package com.codex.worldconsole;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public final class MainActivity extends Activity {
    private static final String LOCAL_START_PAGE = "file:///android_asset/www/index.html";

    private WebView webView;
    private Uri allowedRemoteOrigin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String configuredUrl = BuildConfig.WORLD_CONSOLE_URL == null
            ? ""
            : BuildConfig.WORLD_CONSOLE_URL.trim();
        allowedRemoteOrigin = configuredUrl.isEmpty() ? null : Uri.parse(configuredUrl);

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));
        setContentView(webView);

        boolean remoteMode = allowedRemoteOrigin != null;
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(remoteMode);
        settings.setDomStorageEnabled(remoteMode);
        settings.setDatabaseEnabled(false);
        settings.setAllowFileAccess(!remoteMode);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }
        WebView.setWebContentsDebuggingEnabled(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri target = request.getUrl();
                if (!request.isForMainFrame()) {
                    return !isAllowedInsideWebView(target);
                }
                return handleNavigation(target, request.hasGesture());
            }

            @Override
            @SuppressWarnings("deprecation")
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleNavigation(Uri.parse(url), false);
            }
        });

        webView.loadUrl(remoteMode ? configuredUrl : LOCAL_START_PAGE);
    }

    private boolean handleNavigation(Uri target, boolean userInitiated) {
        if (isAllowedInsideWebView(target)) {
            return false;
        }
        String scheme = target.getScheme();
        if (userInitiated && ("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme))) {
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, target));
            } catch (RuntimeException ignored) {
                // Keep an unsupported external link out of the privileged WebView.
            }
        }
        return true;
    }

    private boolean isAllowedInsideWebView(Uri target) {
        if (allowedRemoteOrigin == null) {
            return "file".equalsIgnoreCase(target.getScheme())
                && target.toString().startsWith("file:///android_asset/www/");
        }
        return equalsIgnoreCase(allowedRemoteOrigin.getScheme(), target.getScheme())
            && equalsIgnoreCase(allowedRemoteOrigin.getHost(), target.getHost())
            && normalizedPort(allowedRemoteOrigin) == normalizedPort(target);
    }

    private static int normalizedPort(Uri uri) {
        if (uri.getPort() >= 0) return uri.getPort();
        return "https".equalsIgnoreCase(uri.getScheme()) ? 443 : 80;
    }

    private static boolean equalsIgnoreCase(String left, String right) {
        return left != null && right != null && left.equalsIgnoreCase(right);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}

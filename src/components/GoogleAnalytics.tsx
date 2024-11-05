import Script from "next/script";
import React from "react";

const GoogleAnalytics = () => {
  return (
    <>
      {/* Google Tag Manager */}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', '${process.env.NEXT_PUBLIC_MEASUREMENT_ID}');
           `}
      </Script>

      {/* Micorsoft Clarity */}
      <Script type="text/javascript">{`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "oq9jwkfixk");`}</Script>

      <Script type="text/javascript">
      {
        `window.$crisp=[];window.CRISP_WEBSITE_ID="9ddba37e-69e0-4dcd-9b81-4807cd522132";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`
      }</Script>
    </>
  );
};

export default GoogleAnalytics;

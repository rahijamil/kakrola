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
    </>
  );
};

export default GoogleAnalytics;

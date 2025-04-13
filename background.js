// background.js
chrome.webRequest.onCompleted.addListener(
  function(details) {
    // 응답 헤더에서 content-type을 확인합니다.
    const contentTypeHeader = details.responseHeaders.find(header =>
      header.name.toLowerCase() === 'content-type'
    );
    if (contentTypeHeader && contentTypeHeader.value.includes('application/vnd.apple.mpegurl')) {
      // HLS 스트림(m3u8) 요청이 감지되었습니다.
      console.log("Detected HLS stream:", details.url);
      
      // 추가 메타데이터가 필요하다면, details 객체의 다른 속성을 이용할 수 있습니다.
      // 예: requestTime, responseHeaders 중 다른 헤더(예: content-length) 등...
      
      // 추출된 정보를 저장하거나 팝업으로 전송할 수도 있습니다.
      chrome.storage.local.get({hlsStreams: []}, function(result){
        const streams = result.hlsStreams;
        streams.push({
          url: details.url,
          time: new Date(details.timeStamp).toLocaleString()
        });
        chrome.storage.local.set({hlsStreams: streams});
      });
    }
  },
  { urls: ["*://educodegenius.com/*"] },
  ["responseHeaders"]
);

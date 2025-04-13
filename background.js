// background.js
chrome.webRequest.onCompleted.addListener(
  function(details) {
    // 응답 헤더에서 content-type 값을 확인
    const contentTypeHeader = details.responseHeaders.find(header =>
      header.name.toLowerCase() === 'content-type'
    );
    if (contentTypeHeader && contentTypeHeader.value.includes('application/vnd.apple.mpegurl')) {
      console.log("Detected HLS stream:", details.url);
      
      // 현재 저장된 스트림 리스트를 가져와서 추가
      chrome.storage.local.get({ hlsStreams: [] }, function(result) {
        const streams = result.hlsStreams;
        // 간단히 중복을 피하기 위해 URL 기준으로 확인
        if (!streams.find(s => s.url === details.url)) {
          streams.push({
            url: details.url,
            time: new Date(details.timeStamp).toLocaleString(),
            tabId: details.tabId
          });
          chrome.storage.local.set({ hlsStreams: streams }, function() {
            console.log("새 스트림 저장됨:", details.url);
          });
        }
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

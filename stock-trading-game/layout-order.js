(() => {
  const arrange = () => {
    const center = document.querySelector('.center-column');
    const left = document.querySelector('.left-column');
    const quote = center?.querySelector('.quote-panel');
    const order = center?.querySelector('.order-panel');
    const news = document.querySelector('.news-panel');
    const market = left?.querySelector('.market-panel');
    if (!center || !left || !quote || !order || !news || !market) return setTimeout(arrange, 80);

    // 株価の直下に注文を置く
    if (order.previousElementSibling !== quote) quote.insertAdjacentElement('afterend', order);
    // ニュースはマーケット一覧の下、左列の最下部に置く
    if (news.previousElementSibling !== market) market.insertAdjacentElement('afterend', news);
  };
  arrange();
})();
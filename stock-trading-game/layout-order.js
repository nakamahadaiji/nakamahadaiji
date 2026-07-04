(() => {
  const arrange = () => {
    const center = document.querySelector('.center-column');
    const quote = center?.querySelector('.quote-panel');
    const order = center?.querySelector('.order-panel');
    const news = center?.querySelector('.news-panel');
    if (!center || !quote || !order || !news) return setTimeout(arrange, 80);
    if (order.nextElementSibling !== news) quote.insertAdjacentElement('afterend', order);
  };
  arrange();
})();
const inteval = setInterval(() => {
  const slides = document.querySelectorAll(".slides");
  if (slides) {
    Reveal.initialize({});
    clearInterval(inteval);
  }
}, 1000);

(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  document.querySelector("#app").innerHTML = "Hello world!";
})();

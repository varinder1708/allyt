var okrs = (function () {
  let config = {
    api: 'https://okrcentral.github.io/sample-okrs/db.json'
  }
  let convertToJson = (data) => {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(data));
    })

  }
  let render = (template, node) => {
    node.innerHTML = template;
  };
  let get = (url) => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = () => req.status === 200
        ? resolve(req.response)
        : reject(Error(req.statusText));
      req.onerror = (e) => reject(Error(`Network Error: ${e}`));
      req.send();
    });
  }

  let displayItems = () => {
    data = this.data;
    var filter = document
      .querySelector(".filter")
      .value
      .toLowerCase();
    let arr = data.data;
    let company = [];
    let str = "<ul>";
    arr.forEach(function (item, index) {
      if ((filter == "" && item.parent_objective_id == "") || (filter != "" && item.parent_objective_id == "" && filter == item.category.toLowerCase())) {
        str += '<li class="show"><span>' + item.title + '</span>';
        str += '<ul>'
        arr.forEach(function (subItem, index) {
          if (item.id == subItem.parent_objective_id) 
            str += '<li>' + subItem.title + '</li>'
        })
        str += '</ul>'
        str += '</li>'
        company.push(item.category);
      };
    });
    str += '</ul>';
    var categories = [...new Set(company)]
    okrs.render(str, document.querySelector('.results'));
  }

  let bindEvents = () => {
    document
      .querySelector('.results')
      .addEventListener("click", function (e) {
        if (e.target && e.target.nodeName == "SPAN") {
          e.target.parentElement.className = e.target.parentElement.className != "hide"
            ? "hide"
            : "show";
        }
      })

    var input = document.querySelector(".filter");
    input.addEventListener("keyup", function (event) {
      displayItems();
    });

  }
  let init = () => {
    okrs
      .get(config.api)
      .then((data) => {
        okrs
          .convertToJson(data)
          .then((data) => {
            this.data = data;
            okrs.displayItems();
            bindEvents();
          })
      })
  }
  return {get: get, convertToJson: convertToJson, displayItems: displayItems, render: render, init: init}

})()

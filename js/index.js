// axios.defaults.headers.common["api-key"] = "d9c93346";

// axios.defaults.baseURL = "http://www.omdbapi.com";

const typesArr = ["movie", "series", "episode"];
let filimIndex = 0;
let filimIndexHalHazirki = 1;
let filimArray = [];

const apiClient = axios.create({
  baseURL: "http://www.omdbapi.com",
  params: {
    apikey: "d9c93346",
  },
});

const searchButton = document.querySelector(".searchButton");
const searchType = document.querySelector(".searchType");
const filmsUl = document.querySelector(".filmsUl");
const searchTitle = document.querySelector(".searchTitle");
const detalsDiv = document.querySelector(".detalsDiv");
const nextPageDiv = document.querySelector(".nextPageDiv");

const buttons = document.querySelectorAll(".buttonPage");
buttons.forEach((e) => {
  e.disabled = true;
});

function fillInSelectType() {
  typesArr.forEach((element) => {
    const optino = document.createElement("option");

    optino.value = element;
    optino.text = element;

    searchType.appendChild(optino);
  });
}

fillInSelectType();

searchButton.addEventListener("click", async (e) => {
  e.preventDefault();

  filmsUl.innerHTML = "";
  const randomIDArr = [];
  let searchCount = 0;

  let inputSearchYoxla = false;
  let searchFilim;
  filimArray = [];

  if (searchTitle.value != "") {
    inputSearchYoxla = true;
  }

  for (let i = 0; i < 3; i += 1) {
    searchCount += 1;

    if (searchCount == 70) {
      break;
    }

    if (inputSearchYoxla) {
      const rese = await apiClient.get(`/?t=${searchTitle.value}`);

      let img = rese.data.Poster;

      if (rese.data.Poster == "N/A") {
        img = `data:image/png;base64,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`;
      }

      const li = `<li>
      
        <img width="150px" height="150px" src=${img} alt="filimImg">

        <div>

          <p>${rese.data.Type}</p>
          <p width=70dpx style="font-weight: 700; font-size: 18px" >${
            rese.data.Title
          }</p>
          <p  font-size: 20px" >${new Date(
            rese.data.Released
          ).getFullYear()}</p>
          <button class="btn_secilmis">Details</button>

        </div>
      
      
      </li>`;
      filimArray.push(li);
      randomIDArr.push(rese.data.imdbID);
      filmsUl.insertAdjacentHTML("beforeend", li);

      const btnDetals = document.querySelector(`.btn_secilmis`);
      btnDetals.addEventListener("click", (e) => {
        let div = `
        <p style="text-align: center;">Filim Info</p>
        <div style="display: flex; border: 1px solid black;">
        
          <img height="400" width="150" src="${img}" alt="POSTER">
          <div>
              <p>Title:      ${rese.data.Title} </p>
              <p>Released:   ${rese.data.Released} </p>
              <p>Genre:      ${rese.data.Genre} </p>
              <p>Country:    ${rese.data.Country} </p>
              <p>Director:   ${rese.data.Director} </p>
              <p>Wirter:     ${rese.data.Wirter} </p>
              <p>Actors:     ${rese.data.Actors} </p>
              <p>Awards:     ${rese.data.Awards} </p>
          
          
          </div>
        
        
        </div>`;

        detalsDiv.innerHTM = div;
      });

      console.dir(rese);
      inputSearchYoxla = false;
      continue;
    }

    let randomId = Math.floor(Math.random() * 285017 + 1000000);

    console.log("bax");
    const res = await apiClient.get(`/?i=tt${randomId}`);
    // console.dir(res);
    let title;
    let inputTitle = searchTitle.value.toLocaleLowerCase();
    if (res.data.Title) {
      title = res.data.Title.toLocaleLowerCase();
    }
    if (
      res.data.Response != "False" &&
      !randomIDArr.includes(res.data.imdbID) &&
      searchType.value == res.data.Type &&
      title.startsWith(inputTitle)
    ) {
      randomIDArr.push(res.data.imdbID);
      searchCount = 0;
      console.dir(res);
      console.log("bax: ", title); // BAX
      console.log("bax: ", inputTitle); // BAX

      let img = res.data.Poster;

      if (res.data.Poster == "N/A") {
        img = `data:image/png;base64,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`;
      }

      const li = `<li>
      
        <img width="150px" height="150px" src=${img} alt="filimImg">

        <div>

          <p>${res.data.Type}</p>
          <p width=70dpx style="font-weight: 700; font-size: 18px" >${
            res.data.Title
          }</p>
          <p  font-size: 20px" >${new Date(res.data.Released).getFullYear()}</p>
          <button class="btn_${randomId}">Details</button>

        </div>
      
      
      </li>`;
      filmsUl.insertAdjacentHTML("beforeend", li);
      filimArray.push(li);
      const btnDetals = document.querySelector(`.btn_${randomId}`);
      btnDetals.addEventListener("click", (e) => {
        detalsDiv.innerHTML = "";
        let div = `
        <p style="text-align: center;">Filim Info</p>
        <div style="display: flex; border: 1px solid black;">
        
          <img height="400" width="220" src="${img}" alt="POSTER">
          <div class="detalsDivDizayn">
              <div> <p>Title:</p>     <p> ${res.data.Title} </p></div>
              <div> <p>Released:</p>   <p>${res.data.Released} </p></div>
              <div> <p>Genre: </p>    <p> ${res.data.Genre} </p></div>
              <div> <p>Country:</p>   <p> ${res.data.Country} </p></div>
              <div> <p>Director:</p>   <p>${res.data.Director} </p></div>
              <div> <p>Wirter: </p>   <p> ${res.data.Wirter} </p></div>
              <div> <p>Actors:</p>    <p> ${res.data.Actors} </p></div>
              <div> <p>Awards: </p>   <p> ${res.data.Awards} </p></div>
          
          
          </div>
        
        
        </div>`;

        detalsDiv.insertAdjacentHTML("beforeend", div);
      });

      // console.log("random eded: ", randomId, "yx: ", res.data.Response);
    } else {
      i -= 1;
      //console.log("tapdim <;");
      continue;
    }
  }
  filimIndex += 1;

  buttons.forEach((e) => {
    if (e.textContent == ">>") {
      e.disabled = false;
    }
    if (e.textContent == "<<") {
      e.disabled = true;
    }
  });
});

//////////////////////

nextPageDiv.addEventListener("click", async (e) => {
  console.log("arr conut:", filimArray.length); // bax
  if (e.target.textContent == ">>") {
    if (filimIndex == filimIndexHalHazirki) {
      filmsUl.innerHTML = "";
      const randomIDArr = [];
      let searchCount = 0;

      let inputSearchYoxla = false;
      let searchFilim;

      if (searchTitle.value != "") {
        inputSearchYoxla = true;
      }

      for (let i = 0; i < 3; i += 1) {
        searchCount += 1;

        if (searchCount == 70) {
          break;
        }

        if (inputSearchYoxla) {
          const rese = await apiClient.get(`/?t=${searchTitle.value}`);

          let img = rese.data.Poster;

          if (rese.data.Poster == "N/A") {
            img = `data:image/png;base64,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`;
          }

          const li = `<li>
      
        <img width="150px" height="150px" src=${img} alt="filimImg">

        <div>

          <p>${rese.data.Type}</p>
          <p width=70dpx style="font-weight: 700; font-size: 18px" >${
            rese.data.Title
          }</p>
          <p  font-size: 20px" >${new Date(
            rese.data.Released
          ).getFullYear()}</p>
          <button class="btn_secilmis">Details</button>

        </div>
      
      
      </li>`;

          randomIDArr.push(rese.data.imdbID);
          filmsUl.insertAdjacentHTML("beforeend", li);
          filimArray.push(li);

          const btnDetals = document.querySelector(`.btn_secilmis`);
          btnDetals.addEventListener("click", (e) => {
            let div = `
        <p style="text-align: center;">Filim Info</p>
        <div style="display: flex; border: 1px solid black;">
        
          <img height="400" width="150" src="${img}" alt="POSTER">
          <div>
              <p>Title:      ${rese.data.Title} </p>
              <p>Released:   ${rese.data.Released} </p>
              <p>Genre:      ${rese.data.Genre} </p>
              <p>Country:    ${rese.data.Country} </p>
              <p>Director:   ${rese.data.Director} </p>
              <p>Wirter:     ${rese.data.Wirter} </p>
              <p>Actors:     ${rese.data.Actors} </p>
              <p>Awards:     ${rese.data.Awards} </p>
          
          
          </div>
        
        
        </div>`;

            detalsDiv.innerHTM = div;
          });

          console.dir(rese);
          inputSearchYoxla = false;
          continue;
        }

        let randomId = Math.floor(Math.random() * 285017 + 1000000);

        console.log("bax");
        const res = await apiClient.get(`/?i=tt${randomId}`);
        // console.dir(res);
        let title;
        let inputTitle = searchTitle.value.toLocaleLowerCase();
        if (res.data.Title) {
          title = res.data.Title.toLocaleLowerCase();
        }
        if (
          res.data.Response != "False" &&
          !randomIDArr.includes(res.data.imdbID) &&
          searchType.value == res.data.Type &&
          title.startsWith(inputTitle)
        ) {
          randomIDArr.push(res.data.imdbID);
          searchCount = 0;
          console.dir(res);
          console.log("bax: ", title); // BAX
          console.log("bax: ", inputTitle); // BAX

          let img = res.data.Poster;

          if (res.data.Poster == "N/A") {
            img = `data:image/png;base64,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`;
          }

          const li = `<li>
      
        <img width="150px" height="150px" src=${img} alt="filimImg">

        <div>

          <p>${res.data.Type}</p>
          <p width=70dpx style="font-weight: 700; font-size: 18px" >${
            res.data.Title
          }</p>
          <p  font-size: 20px" >${new Date(res.data.Released).getFullYear()}</p>
          <button class="btn_${randomId}">Details</button>

        </div>
      
      
      </li>`;
          filmsUl.insertAdjacentHTML("beforeend", li);
          filimArray.push(li);

          const btnDetals = document.querySelector(`.btn_${randomId}`);
          btnDetals.addEventListener("click", (e) => {
            detalsDiv.innerHTML = "";
            let div = `
        <p style="text-align: center;">Filim Info</p>
        <div style="display: flex; border: 1px solid black;">
        
          <img height="400" width="220" src="${img}" alt="POSTER">
          <div class="detalsDivDizayn">
              <div> <p>Title:</p>     <p> ${res.data.Title} </p></div>
              <div> <p>Released:</p>   <p>${res.data.Released} </p></div>
              <div> <p>Genre: </p>    <p> ${res.data.Genre} </p></div>
              <div> <p>Country:</p>   <p> ${res.data.Country} </p></div>
              <div> <p>Director:</p>   <p>${res.data.Director} </p></div>
              <div> <p>Wirter: </p>   <p> ${res.data.Wirter} </p></div>
              <div> <p>Actors:</p>    <p> ${res.data.Actors} </p></div>
              <div> <p>Awards: </p>   <p> ${res.data.Awards} </p></div>
          
          
          </div>
        
        
        </div>`;

            detalsDiv.insertAdjacentHTML("beforeend", div);
          });

          // console.log("random eded: ", randomId, "yx: ", res.data.Response);
        } else {
          i -= 1;
          //console.log("tapdim <;");
          continue;
        }
      }
      filimIndex += 1;
      filimIndexHalHazirki += 1;
      console.log("arr conut:", filimArray.length); // bax
    } else {
      filmsUl.innerHTML = "";
      filimIndexHalHazirki += 1;
      for (let i = 3; i < filimArray.length * 3; i += 3) {
        if (i / 3 == filimIndexHalHazirki) {
          filmsUl.innerHTML = `${filimArray[i - 3]} ${filimArray[i - 2]} ${
            filimArray[i - 1]
          }`;
        }
      }
    }

    buttons.forEach((e) => {
      if (e.textContent == "<<") {
        e.disabled = false;
      }
    });
  } else if (e.target.textContent == "<<") {
    filmsUl.innerHTML = "";

    console.log("arr conut:", filimArray.length); // bax

    filimIndexHalHazirki -= 1;
    for (let i = 3; i < filimArray.length * 3; i += 3) {
      if (i / 3 == filimIndexHalHazirki) {
        filmsUl.innerHTML = `${filimArray[i - 3]} ${filimArray[i - 2]} ${
          filimArray[i - 1]
        }`;
        console.log("ok test ok", i - 3, i - 2, i - 1);
      }
    }
    if (filimIndexHalHazirki == 1) {
      buttons.forEach((e) => {
        if (e.textContent == "<<") {
          e.disabled = true;
        }
      });
    }
  }
});

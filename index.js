const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE =12

const movies = []
let filteredMovie = []


const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const SearchInput = document.querySelector('#search-input')
const paginator =document.querySelector('#paginator')

function renderMovieList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"ㄜ
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer ">
              <button class="btn btn-info btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${item.id}" >More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  });

  dataPanel.innerHTML = rawHTML
}



function rendervpaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML=''

  for(let page=1; page <=   numberOfPages; page++ ){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
   
 paginator.innerHTML =rawHTML 

}



//page > 
function getMovieByPage(page){

  const data =filteredMovie.length ? filteredMovie : movies


  //page 1 = movvie 0~11
  const StartIndex = (page-1) * MOVIES_PER_PAGE
  return data.slice(StartIndex, StartIndex + MOVIES_PER_PAGE )
}




function showMovieModal(id) {
  // get elements
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  // send request to show api
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results

    // insert data into modal ui
    modalTitle.innerText = data.title 
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  // function isMovieIdMatched(movie){
  //   return movie.id ===id
  // }
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('電影已在收藏清單中了唷～')
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}



// listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite'))
    addToFavorite(Number(event.target.dataset.id))
})


paginator.addEventListener('click',function onPaginatorClicked(event){
 if(event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)

 renderMovieList(getMovieByPage(page))
})


searchForm.addEventListener('submit', function onSearchFormSubmit(event) {
  event.preventDefault()
  const keyword = SearchInput.value.trim().toLowerCase()
  


  // if(!keyword.length){
  //   return alert ('please enter a vaild string')
  // }
  filteredMovie = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovie.length === 0) {
    return alert(' cannt find movies with keyword', +keyword)
  }


  // for (const movie of movies){
  //  if(movie.title.toLowerCase().includes(keyword)){
  //    filteredMovie.push(movie)
  //  }
  // }
  rendervpaginator(filteredMovie.length)
  renderMovieList(getMovieByPage(1))
  
})


axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results)
  rendervpaginator(movies.length)
  renderMovieList(getMovieByPage(1))
})


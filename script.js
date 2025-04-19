let currentPage = 1;
const itemsPerPage = 6;
let filteredAttractions = [];

fetch("attractions.xml")
  .then(res => res.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const attractions = [...data.getElementsByTagName("Attraction")];
    filteredAttractions = attractions;
    populateCategoryFilter(attractions);
    renderPage();

    document.getElementById("categoryFilter").addEventListener("change", e => {
      const category = e.target.value;
      filteredAttractions = category === "all" ? attractions : attractions.filter(a => a.querySelector("Category").textContent.includes(category));
      currentPage = 1;
      renderPage();
    });

    document.getElementById("prevPage").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
      }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
      const maxPage = Math.ceil(filteredAttractions.length / itemsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        renderPage();
      }
    });
  });

function populateCategoryFilter(attractions) {
  const categories = new Set([...attractions].map(a => a.querySelector("Category").textContent.trim()));
  const filter = document.getElementById("categoryFilter");
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
}

function renderPage() {
  const container = document.getElementById("attractionsContainer");
  container.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredAttractions.slice(start, start + itemsPerPage);

  pageItems.forEach(a => {
    const id = a.querySelector("PlaceID").textContent;
    const name = a.querySelector("Name").textContent;
    const city = a.querySelector("City").textContent;
    const image = a.querySelector("Image").textContent;
    const category = a.querySelector("Category").textContent;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
  <img src="${image}" alt="${name}" />
  <h3>${name}</h3>
  <p><strong>Place ID:</strong> ${id}</p>
  <p>${city}</p>
  <p><strong>Category:</strong> ${category}</p>
  <button onclick="location.href='detail.html?id=${id}'">View Details</button>
`;

    container.appendChild(card);
  });

  document.getElementById("pageIndicator").textContent = `Page ${currentPage}`;
}

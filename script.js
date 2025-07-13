let hotelData = [];

function searchHotels() {
  const cityInput = document.getElementById("cityInput").value.trim().toLowerCase();
  const hotelList = document.getElementById("hotelList");

  hotelList.innerHTML = "<p>Searching...</p>";

  fetch("hotel.json")
    .then(response => response.json())
    .then(data => {
      const filtered = data.filter(hotel => 
        hotel.City && hotel.City.toLowerCase() === cityInput
      );

      if (filtered.length > 0) {
        hotelData = filtered;
        showHotels(filtered);
      } else {
        hotelList.innerHTML = "<p>No hotels found in that city.</p>";
      }
    })
    .catch(err => {
      console.error(err);
      hotelList.innerHTML = "<p>Error loading hotel data.</p>";
    });
}

function showHotels(hotels) {
  const hotelList = document.getElementById("hotelList");
  hotelList.innerHTML = "";

  hotels.forEach((hotel, index) => {
    const div = document.createElement("div");
    div.className = "hotel";
    div.innerHTML = `
      <h3>${hotel["Hotel Name"]}</h3>
      <p><strong>Category:</strong> ${hotel.Category}</p>
      <p><strong>City:</strong> ${hotel.City}</p>
      <p><strong>State:</strong> ${hotel.State}</p>
      <p><strong>Rooms:</strong> ${hotel["Total Rooms"]}</p>
      <p><strong>Address:</strong> ${hotel.Address}</p>
      <button onclick="exportHotelToExcel(${index})">Export to Excel</button>
    `;
    hotelList.appendChild(div);
  });
}

function exportHotelToExcel(index) {
  const hotel = hotelData[index];
  const ws = XLSX.utils.json_to_sheet([hotel]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Hotel Info");
  XLSX.writeFile(wb, `${hotel["Hotel Name"] || "hotel"}.xlsx`);
}

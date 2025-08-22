console.log("entered in app");

let currentPage = 1;
let currentCity = "";
let lastFetchedHotels = [];

async function searchHotels(reset = true) {
  console.log("searching...");
  const city = document.getElementById('cityInput').value.trim();
  const resultsContainer = document.getElementById('results');

  if (reset) {
    if (!city) return alert("Please enter a city name.");
    currentCity = city;
    currentPage = 1;
  } else {
    currentPage++;
  }

  resultsContainer.innerHTML = "Loading...";

  const prompt = `
Return only a valid JSON array of 100 hotels in ${currentCity}, each with:
- name (string)
- city (string)
- price_per_night (number)
- rating (number)
- amenities (array of strings)
- available_rooms (number)
- address (string)
- contact_number (string)
- contact_name (string)
 
Page: ${currentPage}

Do not add any explanation. Just return the JSON array directly.
`;

  try {
    console.log("trying...");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    console.log(data);
    const content = data.choices[0].message.content;

    const hotels = JSON.parse(content);
    lastFetchedHotels = hotels;

    resultsContainer.innerHTML = "";
    hotels.forEach(hotel => {
      resultsContainer.innerHTML += `
        <div class="hotel-card">
          <h2>${hotel.name}</h2>
          <p><strong>City:</strong> ${hotel.city}</p>
          <p><strong>Price/Night:</strong> ₹${hotel.price_per_night}</p>
          <p><strong>Rating:</strong> ${hotel.rating} ⭐</p>
          <p><strong>Amenities:</strong> ${hotel.amenities.join(", ")}</p>
          <p><strong>Available Rooms:</strong> ${hotel.available_rooms}</p>
          <p><strong>Address:</strong> ${hotel.address}</p>
          <p><strong>Contact:</strong> ${hotel.contact_name} (${hotel.contact_number})</p>
        </div>
      `;
    });

  } catch (error) {
    resultsContainer.innerHTML = "Failed to fetch hotels.";
    console.error(error);
  }
}

function exportToExcel() {
  if (!lastFetchedHotels.length) {
    alert("No hotels to export. Please search first.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(lastFetchedHotels);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hotels");

  XLSX.writeFile(workbook, `Hotels_${currentCity}_Page${currentPage}.xlsx`);
}

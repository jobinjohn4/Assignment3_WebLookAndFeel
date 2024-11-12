using Microsoft.AspNetCore.Mvc;
using DATAGOV_API_INTRO_8.Services;
using DATAGOV_API_INTRO_8.Models;
using Newtonsoft.Json;
using System.Net.Http;
using System.Linq;

namespace DATAGOV_API_INTRO_8.Controllers
{
    public class HomeController : Controller
    {
        private readonly DataService _dataService;
        private readonly AnalyticService _analyticService;
        private readonly HttpClient _httpClient;

        static string BASE_URL = "https://test.api.amadeus.com/v1";
        static string API_KEY =  "8HdmDFTNjPhuhhCueqaXRZDlear5aMZO4W9Q5pU9";

        

        public HomeController(DataService dataService)
        {
            _dataService = dataService;
            _httpClient = new HttpClient();
        }

        public async Task<IActionResult> AnalyticIndex()
        {
            Console.WriteLine("Index action called.");

            // If the data hasn't been fetched yet, fetch data from the API
            if (!_analyticService.IsDataFetched())
            {
                Console.WriteLine("Fetching data from API...");
                string apiPath = $"{BASE_URL}/travel/analytics/air-traffic/traveled?max=10&api_key={API_KEY}";

                HttpResponseMessage response = await _httpClient.GetAsync(apiPath);
                Console.WriteLine($"API response status code: {response.StatusCode}");

                if (response.IsSuccessStatusCode)
                {
                    string AnalyticsData = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Data fetched from API successfully.");
                    Console.WriteLine($"JSON Response: {AnalyticsData}");

                    // Deserialize the JSON data
                    // https://json2csharp.com/
                    Analytics parks = JsonConvert.DeserializeObject<Analytics>(AnalyticsData);

                    if (parks != null && parks.data != null)
                    {
                        Console.WriteLine($"Number of parks fetched: {parks.data.Count}");
                        _analyticService.AddParks(parks.data);  // Store API data in memory
                        _analyticService.MarkDataAsFetched();   // Mark data as fetched
                    }
                    else
                    {
                        Console.WriteLine("Deserialization failed or no data available.");
                    }
                }
                else
                {
                    Console.WriteLine("Failed to fetch data from API.");
                }
            }
            else
            {
                Console.WriteLine("Data already fetched.");
            }

            // Retrieve all parks from the service
            var parksList = _analyticService.GetAllParks();
            Console.WriteLine($"Number of parks in service: {parksList.Count}");

            // Return the list of parks to the view
            return View(parksList);
        }

        public IActionResult Index()
        {
            var featuredDestinations = _dataService.GetDestinations().Take(4).ToList();
            ViewData["FeaturedDestinations"] = featuredDestinations;
            return View();
        }

        public IActionResult Destinations()
        {
            return View(_dataService.GetDestinations());
        }

        public IActionResult Reviews()
        {
            return View(_dataService.GetReviews());
        }

        [HttpPost]
        public IActionResult AddReview(Review review)
        {
            if (ModelState.IsValid)
            {
                _dataService.AddReview(review);
                return RedirectToAction("Reviews");
            }
            return View("Reviews", _dataService.GetReviews());
        }

        public IActionResult Analytics()
        {
            var bookingCount = _dataService.GetBookings().Count;
            var averageRating = _dataService.GetReviews().Any() ? _dataService.GetReviews().Average(r => r.Rating) : 0;

            ViewData["BookingCount"] = bookingCount;
            ViewData["AverageRating"] = averageRating;

            return View();
        }

        public IActionResult Details(int id)
        {
            var destination = _dataService.GetDestinationById(id);
            if (destination == null)
            {
                return NotFound();
            }
            return View(destination);
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}

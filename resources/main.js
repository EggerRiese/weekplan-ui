const { createApp, ref } = Vue

  createApp({
    data: () => ({
        shoppingList: null
    }),

    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    },

    methods: {
        async fetchData() {
            this.shoppingList = 
            [
                {
                    "name": "Nudeln",
                    "amount": "500",
                    "unit": "g"
                },
                {
                    "name": "Pesto",
                    "amount": "100",
                    "unit": "g"
                },
                {
                    "name": "Cashew Nüsse",
                    "amount": "1 Hand voll",
                    "unit": "h"
                }
            ];
        }
    }
  }).mount('#app')


document.getElementById('meal-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Capture form data
    const formData = new FormData(event.target);

    // Convert form data to JSON
    const data = {};
    const ingredients = {};
    formData.forEach((value, key) => {
        if (key.includes("ingredient")) {
            ingredients[key] = value;
        } else {
            data[key] = value;
        }
    });

    data["ingredients"] = ingredients;

    // Send POST request with JSON data
    fetch('http://localhost:8080/meals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'f82222f3-c6b7-4cbf-8343-2df94e10237f'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
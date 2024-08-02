// Function to change every id from 1 to 2 within the copied div
function changeIds(element, inputId) {
    // Change the id from ending with 1 to ending with 2
    element.id = element.id.slice(0, -1) + inputId;
    element.name = element.name?.slice(0, -1) + inputId;

    // Recursively process all child elements
    for (let i = 0; i < element.children.length; i++) {
        changeIds(element.children[i], inputId);
    }
}

function sendPost(data, endpoint) {
    // Send POST request with JSON data
    fetch('http://localhost:8080/' + endpoint, {
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
}

const { createApp, ref } = Vue

createApp({
    data: () => ({
        tab: 2,
        shoppingList: null,
        mealList: null,
        inputId: 1,
        currentWeek: 0
    }),

    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    },

    methods: {
        switchTab(switchTo) {
            this.tab = switchTo;

            if (this.tab === 1) {
                this.setWeek();
                this.fetchMeals();
            }

            if (this.tab === 3) {
                this.fetchData();
            }
        },
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
        },
        async fetchMeals() {
            this.mealList =
                [
                    {
                        "id": "1",
                        "name": "Nudeln mit Pesto",
                    },
                    {
                        "id": "2",
                        "name": "Pfannkuchen",
                    },
                    {
                        "id": "3",
                        "name": "Mediteraner Auflauf",
                    }
                ];
        },
        createInput() {
            const existingInput = document.getElementById('input-' + this.inputId);
            const newInput = existingInput.cloneNode(true);

            this.inputId++;

            changeIds(newInput, this.inputId);

            document.getElementById(existingInput.id).appendChild(newInput);
        },
        setWeek() {
            const today = new Date();

            // Get the first day of the year
            const startOfYear = new Date(today.getFullYear(), 0, 1);

            // Calculate the number of days between today and the start of the year
            const pastDaysOfYear = (today - startOfYear) / 86400000;

            // Calculate the current week number
            this.currentWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        }
    }
}).mount('#app')


document.getElementById('week-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);

    const data = {
        week: formData.get('week-number'),
        monday: formData.get('week-monday'),
        tuesday: formData.get('week-tuesday'),
        wednesday: formData.get('week-wednesday'),
        thursday: formData.get('week-thursday'),
        friday: formData.get('week-friday'),
        saturday: formData.get('week-saturday'),
        sunday: formData.get('week-sunday'),
    };

    sendPost(data, 'week');
});

document.getElementById('meal-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);

    // Convert form data to JSON
    const data = {
        title: formData.get('meal-title'),
        ingredients: [],
      };
      
      let i = 1;
      while (formData.has('meal-ingredient-' + i)) {
        data.ingredients.push({
          name: formData.get('meal-ingredient-' + i),
          amount: formData.get('meal-ingredient-amount-' + i),
          unit: formData.get('meal-ingredient-unit-' + i),
        });
        i++;
      }

      sendPost(data, 'meal');
});
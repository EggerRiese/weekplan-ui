const apiKey = 'f82222f3-c6b7-4cbf-8343-2df94e10237f';
const apiUrl = 'http://localhost:8080/';

// Function to change every id from 1 to 2 within the copied div
function changeIds(element, inputId) {
    // Change the id from ending with 1 to ending with 2
    element.id = element.id.slice(0, -1) + inputId;
    element.name = element.name?.slice(0, -1) + inputId;
    
    if (!element.id.includes('unit')) {
        element.value = ''
    }

    // Recursively process all child elements
    for (let i = 0; i < element.children.length; i++) {
        changeIds(element.children[i], inputId);
    }
}

function sendPost(data, endpoint) {
    // Send POST request with JSON data
    fetch(apiUrl + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status === 200) {
                console.log('success')
            } else {
                console.log(response.status)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const { createApp, ref } = Vue

createApp({
    data: () => ({
        tab: 1,
        shoppingList: null,
        mealList: null,
        inputId: 1,
        currentWeek: 0,
        currentHighlighterPosition: 0
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
            var tablist = document.getElementById('tablist-container');
            var highlighter = document.getElementById('highlighter');

            var middlePoint = tablist.clientWidth / 2 - highlighter.clientWidth / 2;

            if (this.tab === 1) {
                highlighter.style.setProperty('--highlight-start-one', this.currentHighlighterPosition + 'px');
                highlighter.style.setProperty('--highlight-end', '0px');

                highlighter.classList.add('move-to-one');
                highlighter.classList.remove('move-to-two');
                highlighter.classList.remove('move-to-three');

                this.currentHighlighterPosition = 0;
            } else if (this.tab === 2) {
                highlighter.style.setProperty('--highlight-start-two', this.currentHighlighterPosition + 'px');
                highlighter.style.setProperty('--highlight-end-two', middlePoint + 'px');
                
                highlighter.classList.add('move-to-two');
                highlighter.classList.remove('move-to-one');
                highlighter.classList.remove('move-to-three');

                this.setWeek();
                this.fetchMeals();
                
                this.currentHighlighterPosition = middlePoint;
            } else if (this.tab === 3) {
                highlighter.style.setProperty('--highlight-start-three', this.currentHighlighterPosition + 'px');
                highlighter.style.setProperty('--highlight-end-three', middlePoint * 2 + 'px');
                
                
                highlighter.classList.add('move-to-three');
                highlighter.classList.remove('move-to-one');
                highlighter.classList.remove('move-to-two');

                this.fetchData();
                
                this.currentHighlighterPosition = middlePoint * 2;
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
            fetch(apiUrl + 'meals', {
                method: 'GET',
                headers: {
                    'X-API-KEY': apiKey
                },
            })
                .then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json(); // Parse JSON response
                })
                .then(data => {
                    this.mealList = data;
                    console.log(data); // Handle the data
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            /* this.mealList =
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
                ]; */
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
        },
        sendNotification() {
            Notification.requestPermission().then((result) => {
                if (result === "granted") {
                    const options = {
                        body: "Super Duper",
                        icon: "/resources/logo.png",
                      };
                    new Notification("Hello", options);
                }
            });
        }
    }
}).mount('#app')


document.getElementById('week-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);

    const data = {
        id: formData.get('week-number'),
        mondayMealId: formData.get('week-monday'),
        tuesdayMealId: formData.get('week-tuesday'),
        wednesdayMealId: formData.get('week-wednesday'),
        thursdayMealId: formData.get('week-thursday'),
        fridayMealId: formData.get('week-friday'),
        saturdayMealId: formData.get('week-saturday'),
        sundayMealId: formData.get('week-sunday'),
    };

    sendPost(data, 'weeks');
});

document.getElementById('meal-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);

    // Convert form data to JSON
    const data = {
        name: formData.get('meal-title'),
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

      sendPost(data, 'meals');
});
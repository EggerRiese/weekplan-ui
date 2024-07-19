export default {
    props: {
      todo: Object
    },
    template: `
    <div class="sm:col-span-2 relative mt-2">
        <input type="text" name="meal-ingredient" id="meal-ingredient" autocomplete="text" placeholder="Ingredient" class="peer input rounded-b-none">
        <label for="meal-ingredient" class="input-label">Ingredient{{ todo.text }}</label>
    </div
    <div class="sm:col-span-2 relative">
        <input type="text" name="meal-ingredient" id="meal-ingredient" autocomplete="text" placeholder="Amount" class="peer input border-t-0 rounded-t-none">
        <label for="meal-ingredient-amount" class="input-label">Amount</label>
        <div class="absolute border-l inset-y-0 right-0 flex items-center">
            <label for="unit" class="sr-only">Maßeinheit</label>
            <select id="unit" name="unit" class="h-full text-right rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-0 sm:text-sm">
              <option>g</option>
              <option>ml</option>
              <option>hv</option>
            </select>
            <svg class="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
        </div>
    </div>
    `
}
  
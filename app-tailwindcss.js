import { createApp, ref, onMounted } from 'vue';
import { Sortable, MultiDrag } from 'sortablejs';

const templateElement = document.getElementById('app-template');

// Khởi tạo Vue App
const app = createApp({
  setup() {
    // State cho các item trong hai list, mỗi item là một object với id, name và settings
    const leftItems = ref([
      { id: 1, name: 'Item 1', settings: { color: 'blue' } },
      { id: 2, name: 'Item 2', settings: { color: 'green' } },
      { id: 3, name: 'Item 3', settings: { color: 'red' } },
      { id: 4, name: 'Item 4', settings: { color: 'yellow' } },
      { id: 5, name: 'Item 5', settings: { color: 'purple' } },
      { id: 6, name: 'Item 6', settings: { color: 'orange' } }
    ]);

    const example2Left = ref(null);
    const example2Right = ref(null);

    const storedLeftItems = ref(leftItems.value.map(item => item.id.toString()));

    const rightItems = ref([
      { id: 7, name: 'Item 7', settings: { color: 'blue' } },
      { id: 8, name: 'Item 8', settings: { color: 'green' } },
      { id: 9, name: 'Item 9', settings: { color: 'red' } },
      { id: 10, name: 'Item 10', settings: { color: 'yellow' } },
      { id: 11, name: 'Item 11', settings: { color: 'purple' } },
      { id: 12, name: 'Item 12', settings: { color: 'orange' } }
    ]);

    const storedRightItems = ref(rightItems.value.map(item => item.id.toString()));

    // Hàm cập nhật danh sách sau khi kéo thả
    const updateItemsOrder = () => {
      // loop through example2Left element and update the order
      storedLeftItems.value = Array.from(example2Left.value.children).map(item => item.dataset?.id);
      // loop through example2Right element and update the order
      storedRightItems.value = Array.from(example2Right.value.children).map(item => item.dataset?.id);
    };

    // Mounted hook để khởi tạo sortable
    onMounted(() => {
      templateElement.remove();

      Sortable.mount(new MultiDrag());

      // Tạo sortable cho danh sách bên trái
      new Sortable(example2Left.value, {
        group: {
          name: 'shared'
        },
        animation: 150,
        multiDrag: true,
        selectedClass: 'bg-blue-500',
        fallbackTolerance: 3,
        onEnd(evt) {
          console.log('onEnd example2Left', evt);
          updateItemsOrder();
        },
      });

      // Tạo sortable cho danh sách bên phải
      new Sortable(example2Right.value, {
        group: 'shared',
        animation: 150,
        multiDrag: true,
        selectedClass: 'bg-blue-500',
        fallbackTolerance: 3,
        onSort(evt) {
          console.log('onSort example2Right', evt);
          updateItemsOrder();
        },
      });
    });

    const moveAllFromRight = () => {
      const items = Array.from(example2Right.value.children); // Get all items from the right list

      // Move each item from left to right
      items.forEach(item => {
        example2Left.value.appendChild(item); // Move the item to the right list
      });

      updateItemsOrder();
    };

    const moveAllFromLeft = () => {
      const items = Array.from(example2Left.value.children); // Get all items from the right list

      // Move each item from left to right
      items.forEach(item => {
        example2Right.value.appendChild(item); // Move the item to the right list
      });

      updateItemsOrder();
    };

    function customSort(arr) {
      // Function to extract the last number in the string (if any)
      const extractNumberFromEnd = (text) => {
        const match = text.match(/(\d+)$/);  // Match digits at the end of the string
        return match ? parseInt(match[1], 10) : NaN;  // Return the number or NaN if not found
      };
    
      // Function to extract the leading number (if any)
      const extractLeadingNumber = (text) => {
        const match = text.match(/^(\d+)/);  // Match leading digits
        return match ? parseInt(match[1], 10) : NaN;  // Return the number or NaN if not found
      };
    
      return arr.sort((a, b) => {
        // Extract leading and trailing numbers
        const leadingNumA = extractLeadingNumber(a.innerText);
        const leadingNumB = extractLeadingNumber(b.innerText);
    
        const trailingNumA = extractNumberFromEnd(a.innerText);
        const trailingNumB = extractNumberFromEnd(b.innerText);
    
        // Case 1: If both texts start with numbers, compare them numerically
        if (!isNaN(leadingNumA) && !isNaN(leadingNumB)) {
          return leadingNumA - leadingNumB;  // Compare by leading number
        }
    
        // Case 2: If only one of the texts starts with a number, that one comes first
        if (!isNaN(leadingNumA)) return -1;  // `a` comes first
        if (!isNaN(leadingNumB)) return 1;   // `b` comes first
    
        // Case 3: If neither text starts with a number, compare by trailing number (if any)
        if (!isNaN(trailingNumA) && !isNaN(trailingNumB)) {
          return trailingNumA - trailingNumB;  // Compare by trailing number
        }
    
        // Case 4: If neither starts with a number and there are no trailing numbers, compare alphabetically
        return a.innerText.localeCompare(b.innerText);
      });
    };

    const sortList = (isLeftList) => {
      let list = null;
      let arrIds2 = [];
      if (isLeftList) {
        list = example2Left.value;
        arrIds2 = storedLeftItems.value;
      } else {
        list = example2Right.value;
        arrIds2 = storedRightItems.value;
      }

      let items = Array.from(list.children);
      customSort(items);

      // check if we need to sort
      const arrIds = items.map(item => item.dataset?.id).filter(Boolean);
      if (arrIds.length === 0) return;
      if (JSON.stringify(arrIds) === JSON.stringify(arrIds2)) {
        console.log('The list is already sorted', arrIds);
        return;
      }

      // Remove all the children from the parent node
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      items.forEach(item => {
        list.appendChild(item);
      });

      updateItemsOrder();
    }

    return {
      leftItems, rightItems,
      storedLeftItems, storedRightItems,
      example2Left, example2Right,
      moveAllFromRight, moveAllFromLeft,
      sortList
    };
  },
  template: templateElement.innerHTML
});

// Mount app vào div#app
app.mount('#app');

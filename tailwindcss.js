import { Sortable, MultiDrag } from 'sortablejs';

document.addEventListener('DOMContentLoaded', function () {
  const leftItems = [
    { id: 1, name: 'Item 1', settings: { color: 'blue' } },
    { id: 2, name: 'Item 2', settings: { color: 'green' } },
    { id: 3, name: 'Item 3', settings: { color: 'red' } },
    { id: 4, name: 'Item 4', settings: { color: 'yellow' } },
    { id: 5, name: 'Item 5', settings: { color: 'purple' } },
    { id: 6, name: 'Item 6', settings: { color: 'orange' } }
  ];

  const rightItems = [
    { id: 7, name: 'Item 7', settings: { color: 'blue' } },
    { id: 8, name: 'Item 8', settings: { color: 'green' } },
    { id: 9, name: 'Item 9', settings: { color: 'red' } },
    { id: 10, name: 'Item 10', settings: { color: 'yellow' } },
    { id: 11, name: 'Item 11', settings: { color: 'purple' } },
    { id: 12, name: 'Item 12', settings: { color: 'orange' } }
  ];

  const storedLeftItems = leftItems.map(item => item.id.toString());
  const storedRightItems = rightItems.map(item => item.id.toString());

  // DOM elements
  const leftList = document.querySelector('#example2Left');
  const rightList = document.querySelector('#example2Right');
  const moveAllFromLeft = document.querySelectorAll('#shared-lists button.moveAllFromLeft');
  const moveAllFromRight = document.querySelectorAll('#shared-lists button.moveAllFromRight');
  const sortLeftBtn = document.querySelector('#sortLeft');
  const sortRightBtn = document.querySelector('#sortRight');

  // Create HTML for Left List
  leftItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-blue-400 bg-slate-100 active:bg-blue-400';
    div.dataset.id = item.id;
    div.innerText = item.name;
    leftList.appendChild(div);
  });

  // Create HTML for Right List
  rightItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-blue-400 bg-slate-100 active:bg-blue-400';
    div.dataset.id = item.id;
    div.innerText = item.name;
    rightList.appendChild(div);
  });

  // Initialize Sortable for the left and right lists
  Sortable.mount(new MultiDrag());

  new Sortable(leftList, {
    group: { name: 'shared' },
    sort: true,
    animation: 150,
    multiDrag: true,
    selectedClass: 'bg-blue-500',
    fallbackTolerance: 3,
    onEnd: updateItemsOrder
  });

  new Sortable(rightList, {
    group: 'shared',
    animation: 150,
    multiDrag: true,
    selectedClass: 'bg-blue-500',
    fallbackTolerance: 3,
    onSort: updateItemsOrder
  });

  function renderStoredItems() {
    document.querySelector('#storedLeftItems').textContent = JSON.stringify(storedLeftItems);
    document.querySelector('#storedRightItems').textContent = JSON.stringify(storedRightItems);
  };

  // Function to update the order of items
  function updateItemsOrder() {
    storedLeftItems.length = 0;
    storedRightItems.length = 0;

    // Update left items order
    Array.from(leftList.children).forEach(item => {
      storedLeftItems.push(item.dataset.id);
    });

    // Update right items order
    Array.from(rightList.children).forEach(item => {
      storedRightItems.push(item.dataset.id);
    });

    renderStoredItems();
  };

  function moveAllItems(fromList, toList) {
    Array.from(fromList.children).forEach(item => {
      toList.appendChild(item);
    });
    updateItemsOrder();
  };

  // Move all items from left to right
  moveAllFromLeft.forEach(btn => {
    btn.addEventListener('click', () => {
      moveAllItems(leftList, rightList);
    });
  });

  // Move all items from right to left
  moveAllFromRight.forEach(btn => {
    btn.addEventListener('click', () => {
      moveAllItems(rightList, leftList);
    });
  });

  // Sort the left list
  sortLeftBtn.addEventListener('click', () => {
    sortList(leftList, storedLeftItems);
  });

  // Sort the right list
  sortRightBtn.addEventListener('click', () => {
    sortList(rightList, storedRightItems);
  });

  // Function to sort the items
  function sortList(list, storedItems) {
    const items = Array.from(list.children);
    customSort(items);

    const ids = items.map(item => item.dataset.id);
    if (JSON.stringify(ids) === JSON.stringify(storedItems)) {
      console.log('The list is already sorted');
      return;
    }

    // Remove all children and re-append in sorted order
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    items.forEach(item => {
      list.appendChild(item);
    });

    updateItemsOrder();
  }

  // Function to perform custom sorting
  function customSort(arr) {
    const extractNumberFromEnd = (text) => {
      const match = text.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : NaN;
    };

    const extractLeadingNumber = (text) => {
      const match = text.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : NaN;
    };

    arr.sort((a, b) => {
      const leadingNumA = extractLeadingNumber(a.innerText);
      const leadingNumB = extractLeadingNumber(b.innerText);

      const trailingNumA = extractNumberFromEnd(a.innerText);
      const trailingNumB = extractNumberFromEnd(b.innerText);

      if (!isNaN(leadingNumA) && !isNaN(leadingNumB)) {
        return leadingNumA - leadingNumB;
      }

      if (!isNaN(leadingNumA)) return -1;
      if (!isNaN(leadingNumB)) return 1;

      if (!isNaN(trailingNumA) && !isNaN(trailingNumB)) {
        return trailingNumA - trailingNumB;
      }

      return a.innerText.localeCompare(b.innerText);
    });
  };

  renderStoredItems();
});

import { useEffect, useState } from "react";
import "./App.css";
import "./index.css";

// const initialItems = [
//  { id: 1, description: "Passports", quantity: 2, packed: false },
// ];

function App() {
 const [value, setValue] = useState(function () {
  const storeValue = localStorage.getItem("key");
  console.log(JSON.parse(storeValue));
  return JSON.parse(storeValue);
 });

 function handler(item) {
  setValue((curr) => [...curr, item]);
  // localStorage.setItem("1", JSON.stringify(value));
 }
 function removeItem(id) {
  setValue((items) => items.filter((item) => item.id !== id));
 }

 function toggle(id) {
  setValue((item) =>
   item.map((curr) =>
    curr.id === id ? { ...curr, packed: !curr.packed } : curr
   )
  );
 }
 function Reset() {
  const confirm = window.confirm("Are you sure you want to delete all items?");

  if (confirm) setValue([]);
 }
 useEffect(() => {
  localStorage.setItem("key", JSON.stringify(value));
 }, [value]);

 return (
  <div className="app">
   <Logo />
   <Form onAddItem={handler} />
   <PackingList
    onRemoveItem={removeItem}
    items={value}
    onToggle={toggle}
    onReset={Reset}
   />
   <Stats items={value} />
  </div>
 );
}

export default App;

function Logo() {
 return <h1 className="">🌴Far Away💼</h1>;
}
function Form({ onAddItem }) {
 const [description, setDescription] = useState("");
 const [quantity, setQuantity] = useState(1);
 function formHandler(e) {
  e.preventDefault();

  const newItem = { description, quantity, packed: false, id: Date.now() };
  //console.log(newItem);
  onAddItem(newItem);
  setDescription("");
  setQuantity(1);
 }

 return (
  <div>
   <form className="add-form" onSubmit={formHandler}>
    <h3>what do you need for 😊 trip</h3>
    <select value={quantity} onChange={(e) => setQuantity(+e.target.value)}>
     {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
      <option
       value={num}
       key={num}
       onChange={(e) => setQuantity(e.target.value)}
      >
       {num}
      </option>
     ))}
    </select>
    <input
     type="text"
     placeholder="Items.."
     value={description}
     onChange={(e) => setDescription(e.target.value)}
    />
    <button type="submit">Add</button>
   </form>
  </div>
 );
}
function PackingList({ items, onRemoveItem, onToggle, onReset }) {
 const [sortBy, setSortBy] = useState("input");
 let sortItems;

 if (sortBy === "input") sortItems = items;
 if (sortBy === "description")
  sortItems = items
   .slice()
   .sort((a, b) => a.description.localeCompare(b.description));
 if (sortBy === "packed")
  sortItems = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed));
 return (
  <div className="list">
   <ul style={{ overflow: "hidden" }}>
    {sortItems.map((item) => (
     <Item
      items={item}
      key={item.id}
      removeItem={onRemoveItem}
      onToggle={onToggle}
     ></Item>
    ))}
   </ul>

   <div className="actions">
    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
     <option value="input">SortBy Input-items</option>
     <option value="description">SortBy description</option>
     <option value="packed">SortBy Selected-items</option>
    </select>
    <button onClick={() => onReset()}> ClearList</button>
   </div>
  </div>
 );
}
function Item({ items, removeItem, onToggle }) {
 return (
  <li>
   <input
    type="checkbox"
    value={items.packed}
    onClick={() => onToggle(items.id)}
   />
   <span style={items.packed ? { textDecoration: "line-through" } : {}}>
    {items.quantity} {items.description}
   </span>
   <button onClick={() => removeItem(items.id)}>❌&times</button>
  </li>
 );
}

function Stats({ items }) {
 //console.log(items.packed);
 if (!items.length)
  return (
   <p className="stats">
    <em>Start adding some-items in your PackingList. 💼</em>
   </p>
  );
 const numItems = items.length;

 const numPacked = items.filter((item) => item.packed).length;
 const percentage = Math.round((numPacked / numItems) * 100);
 console.log(numPacked);

 return (
  <em>
   <footer className="stats">
    {percentage === 100
     ? "You got everything! Ready to go ✈"
     : `💼 You have ${numItems} items on your list. and you already packed
    ${numPacked} (${percentage}%)`}
   </footer>
  </em>
 );
}

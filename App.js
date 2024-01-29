import React, { useState } from "react";
// import Card from "./Card";
// const initialItems = [
//  { id: 1, description: "Passports", quantity: 2, packed: false },
//  { id: 2, description: "Socks", quantity: 12, packed: true },
// ];
const App = () => {
 const [item, setItem] = useState([]);
 //// Adding Items
 const handleAddItem = (items) => {
  setItem((item) => [...item, items]);
 };
 //// Removing Items
 const removeItem = (id) => {
  const value = item.filter((el) => el.id !== id);
  // setItem((el) => el.filter((item) => item.id !== id));
  setItem(value);
 };

 //// Handling check-box
 const checkBox = (id) => {
  setItem((item) =>
   item.map((el) => (el.id === id ? { ...el, packed: !el.packed } : el))
  );
 };

 //Reset
 const resetList = () => {
  const confirm = window.confirm("Are you sure you want to delete all items?");

  if (item.length === 0) return;

  if (confirm) setItem([]);
 };
 return (
  <div className="app">
   <Logo />
   <Form onAddItem={handleAddItem} />
   <PackingList
    items={item}
    onRemoveItem={removeItem}
    onCheck={checkBox}
    onResetItem={resetList}
   />
   <Stats items={item} />
  </div>
 );
};

export default App;

const Logo = () => {
 return (
  <div>
   <h1>🌴 Far Away 💼</h1>
  </div>
 );
};

const PackingList = ({ items, onRemoveItem, onCheck, onResetItem }) => {
 const [sortBy, setSortBy] = useState("input");
 let sortItem;
 if (sortBy === "input") sortItem = items;
 if (sortBy === "description")
  sortItem = items
   .slice()
   .sort((a, b) => a.description.localeCompare(b.description));
 if (sortBy === "packed")
  sortItem = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed));
 return (
  <div className="list">
   {sortItem.length === 0 && (
    <p style={{ textDecoration: "2px solid brown underline" }}>
     START ADDING ITEMS.
    </p>
   )}
   <ul>
    {sortItem.map((item) => (
     <Item
      item={item}
      key={item.id}
      onRemoveItem={onRemoveItem}
      onCheck={onCheck}
     />
    ))}
   </ul>
   <div className="actions">
    <select
     name="value"
     id="value"
     onChange={(e) => setSortBy(e.target.value)}
     value={sortBy}
    >
     <option value="input">Sort By Input</option>
     <option value="description">Sort By Description</option>
     <option value="packed">Sort By Packed</option>
    </select>
    <Button onClick={onResetItem}>Reset</Button>
   </div>
  </div>
 );
};
function Item({ item, onRemoveItem, onCheck }) {
 return (
  <li>
   <input
    type="checkbox"
    value={item.packed}
    onChange={() => onCheck(item.id)}
   />
   <span
    style={item.packed ? { textDecoration: "line-through" } : {}}
    key={item.id}
   >
    {item.description} {item.quantity}
   </span>

   <Button onClick={() => onRemoveItem(item.id)}>❌</Button>
  </li>
 );
}

const Stats = ({ items }) => {
 if (!items.length)
  return (
   <footer className="stats">
    <em>
     <p>Start adding some items to your packing list ✈✈</p>
    </em>
   </footer>
  );
 const numItems = items.length;
 const itemPacked = items.filter((el) => el.packed).length;
 let percent = Math.round((itemPacked / numItems) * 100);

 return (
  <div>
   <footer className="stats">
    <em>
     {percent === 100
      ? "You got everything! Ready to go ✈"
      : `  💼 You have ${numItems} items on your list, and you already packed ${itemPacked}(
     ${percent ? percent : "X"}%)`}
    </em>
   </footer>
  </div>
 );
};

function Form({ onAddItem }) {
 const [description, setDescription] = useState("");
 const [quantity, setQuantity] = useState(1);

 // Value from input box
 const inputHandler = (e) => {
  setDescription(e.target.value);
 };

 // Value select from select box
 const selectHandler = (e) => {
  // console.log(e.target.value);
  setQuantity(+e.target.value);
 };
 //// form submit the info that we entered.
 const submitHandler = (e) => {
  e.preventDefault();
  const newItem = { description, quantity, packed: 0, id: Date.now() };
  onAddItem(newItem);
  console.log(newItem);
  setDescription("");
  setQuantity(1);
 };
 return (
  <>
   <form className="add-form" onSubmit={submitHandler}>
    <h3>What do you need for your trip?</h3>
    <select value={quantity} onChange={selectHandler}>
     {Array.from({ length: 20 }, (_, i) => i + 1).map((item) => (
      <option value={item} key={item}>
       {item}
      </option>
     ))}
    </select>
    <input
     type="text"
     placeholder="items..."
     value={description}
     onChange={inputHandler}
    />
    <Button type="submit">Add</Button>
   </form>
   {/* <PackingList description={description} quantity={quantity} /> */}
  </>
 );
}

function Button({ onClick, type, children }) {
 return (
  <button onClick={onClick} type={type}>
   {children}
  </button>
 );
}

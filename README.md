# 🛒 Grocery4U

**Grocery4U** is a modern, user-friendly fullstack web application that allows users to browse, search, and shop a wide variety of grocery products online. Built with EJS and MongoDB, it features dynamic product displays, cart management, and personalized recommendations using product tags and categories.

## 🚀 Features

- 🛍️ Browse products by categories like dairy, snacks, bakery, and more
- 🔍 Powerful search functionality to find products instantly
- 🧠 Smart product recommendations based on tags and categories
- 🧺 Cart management with add/remove/update functionalities
- 📦 "See More" functionality to load products dynamically
- 🖥️ Responsive and clean UI for all screen sizes

## 📂 Tech Stack

- **Frontend**: EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Payments**: Stripe integration for secure checkout


## 🧠 Recommendation Logic

Products are tagged with relevant and complementary keywords (e.g., `bread` has tags like `jam, butter, eggs`). These tags are used to recommend similar or paired products to enhance user experience and boost cross-selling.

## 📁 Project Structure
```
Grocery4U-main/
├── .gitignore
├── app.js
├── app.py
├── kaggle.json
├── package-lock.json
├── package.json
├── config/
│   ├── .gitkeep
│   ├── development.json
│   ├── keys.js
│   ├── mongoose-connection.js
│   └── multer-config.js
├── controllers/
│   ├── .gitkeep
│   └── authController.js
├── css/
│   └── global.css
├── middlewares/
│   └── isLoggedIn.js
├── models/
│   ├── .gitkeep
│   ├── owner-model.js
│   ├── product-model.js
│   └── user-model.js
├── public/
│   └── images/
│       ├── apple.jpg
│       ├── avocado.jpg
│       ├── amul-kool-milk.jpg
│       ├── nescafe-coffee.jpg
│       └── ... (more product images)

```
## ⚙️ Installation & Setup

Follow these steps to run the project locally:

---

### 1. Clone the repository

```bash
git clone https://github.com/ShivamJuyal24/Grocery4U.git
cd Grocery4U
```
### 2. Install backend dependencies
```bash
cd Grocery4U-main
npm install
```
### 3. Set up environment variable
Create a .env file in the root of the backend (Grocery4U-main/) and add:
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

### 4. Start the backend server
```bash
npx nodemon app.js
```


## 📸 Screenshots

---
### 1. Login Page


![Screenshot 2025-04-25 223416](https://github.com/user-attachments/assets/d43fff2a-5193-4310-88f1-26874484ca16)

### 2.Shop Page



![Screenshot 2025-04-25 223504](https://github.com/user-attachments/assets/1431e93f-c4f0-46cd-9ef3-92acfab57867)


### 3. Cart Page With Recommendation



![Screenshot 2025-04-25 223612](https://github.com/user-attachments/assets/38e97953-3165-4aea-a995-0520686ea086)


### 4. Checkout Page



![Screenshot 2025-04-25 223811](https://github.com/user-attachments/assets/1ee1e41b-e2b9-44c3-a395-33794aecda81)


### 5. Succefull Payment



![Screenshot 2025-04-25 223733](https://github.com/user-attachments/assets/e58105d3-6c48-453e-b231-617fcf343606)




## Built with ❤️ by Shivam Juyal











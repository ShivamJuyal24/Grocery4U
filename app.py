from flask import Flask, render_template, request
from pymongo import MongoClient
import random

app = Flask(__name__, template_folder='views')

# Connect to your local MongoDB
client = MongoClient("mongodb://localhost:27017/")

# Select your database and collection
db = client['grocery']  # Replace with your DB name
collection = db['products']  # Replace with your collection name

@app.route('/', methods=['GET', 'POST'])
def index():
    recommended = []
    selected_category = None
    categories = collection.distinct('category')

    if request.method == 'POST':
        selected_category = request.form.get('category')
        
        # Fetch products from the selected category
        products = list(collection.find({'category': selected_category}, {'product': 1, '_id': 0}))
        product_list = [product['product'] for product in products]

        # Randomly select 5 recommendations
        recommended = random.sample(product_list, min(5, len(product_list)))

    return render_template(
        'shop.ejs',
        categories=sorted(categories),
        recommended=recommended,
        selected_category=selected_category
    )

if __name__ == '__main__':
    print("🚀 Starting Flask App...")
    app.run(debug=True)

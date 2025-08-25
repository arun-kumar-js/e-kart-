import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'SpiderEKartDB',
    location: 'default',
  },
  () => {},
  error => {
    console.error('Error opening database:', error);
  }
);

export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      console.log('Initializing database and creating tables if not exist.');
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          description TEXT,
          image TEXT
        );`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY NOT NULL,
          productId INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          FOREIGN KEY (productId) REFERENCES products(id)
        );`
      );
    },
    error => {
      console.error('Error during DB init transaction:', error);
      reject(error);
    },
    () => {
      console.log('Database initialized successfully.');
      resolve();
    });
  });
};

export const insertProduct = (product) => {
  const { id, name, price, description, image } = product;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      console.log(`Inserting or replacing product: id=${id}, name=${name}, price=${price}`);
      tx.executeSql(
        `INSERT OR REPLACE INTO products (id, name, price, description, image) VALUES (?, ?, ?, ?, ?);`,
        [id, name, price, description, image],
        (_, result) => {
          console.log('Product insert/replace successful:', result);
          resolve(result);
        },
        (_, error) => {
          console.error('Error inserting product:', error);
          reject(error);
        }
      );
    });
  });
};

export const getProducts = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      console.log('Fetching all products.');
      tx.executeSql(
        `SELECT * FROM products;`,
        [],
        (_, result) => {
          let products = [];
          for (let i = 0; i < result.rows.length; i++) {
            products.push(result.rows.item(i));
          }
          console.log('Fetched products:', products);
          resolve(products);
        },
        (_, error) => {
          console.error('Error fetching products:', error);
          reject(error);
        }
      );
    });
  });
};

export const addToCart = (product, quantity) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      if (quantity === 0) {
        console.log(`Deleting product from cart: productId=${product.id}`);
        tx.executeSql(
          `DELETE FROM cart WHERE productId = ?;`,
          [product.id],
          (_, result) => {
            console.log('Deleted product from cart:', result);
            resolve(result);
          },
          (_, error) => {
            console.error('Error deleting product from cart:', error);
            reject(error);
          }
        );
      } else {
        console.log(`Adding or updating cart item: productId=${product.id}, quantity=${quantity}`);
        // Before insert/update, log the product details
        console.log(`Product details - id: ${product.id}, name: ${product.name}, price: ${product.price}, quantity: ${quantity}`);
        tx.executeSql(
          `SELECT quantity FROM cart WHERE productId = ?;`,
          [product.id],
          (_, selectResult) => {
            if (selectResult.rows.length > 0) {
              console.log('Updating existing cart item.');
              tx.executeSql(
                `UPDATE cart SET quantity = ? WHERE productId = ?;`,
                [quantity, product.id],
                (_, updateResult) => {
                  console.log('Cart item updated:', updateResult);
                  resolve(updateResult);
                },
                (_, updateError) => {
                  console.error('Error updating cart item:', updateError);
                  reject(updateError);
                }
              );
            } else {
              console.log('Inserting new cart item.');
              tx.executeSql(
                `INSERT INTO cart (productId, quantity) VALUES (?, ?);`,
                [product.id, quantity],
                (_, insertResult) => {
                  console.log('Cart item inserted:', insertResult);
                  resolve(insertResult);
                },
                (_, insertError) => {
                  console.error('Error inserting cart item:', insertError);
                  reject(insertError);
                }
              );
            }
          },
          (_, selectError) => {
            console.error('Error selecting cart item:', selectError);
            reject(selectError);
          }
        );
      }
    });
  });
};

export const getCartItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      console.log('Fetching cart items.');
      tx.executeSql(
        `SELECT cart.productId, cart.quantity, products.name, products.price, products.description, products.image
         FROM cart
         JOIN products ON cart.productId = products.id;`,
        [],
        (_, result) => {
          let items = [];
          for (let i = 0; i < result.rows.length; i++) {
            items.push(result.rows.item(i));
          }
          console.log('Current cart items:', items);
          resolve(items);
        },
        (_, error) => {
          console.error('Error fetching cart items:', error);
          reject(error);
        }
      );
    });
  });
};

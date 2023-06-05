const express = require('express');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to handle the POST request
app.post('/add-identity-to-wallet', async (req, res) => {
  try {
    // Extract the request body parameters
    const { identityLabel, certificatePath, privateKeyPath, mspId } = req.body;

    // Create a new wallet instance
    const wallet = await Wallets.newFileSystemWallet('../identity/user/abhi/wallet');

    // Read the certificate and private key files
    const certificate = fs.readFileSync(path.resolve(__dirname, certificatePath)).toString();
    const privateKey = fs.readFileSync(path.resolve(__dirname, privateKeyPath)).toString();

    // Create the identity object
    const identity = {
      credentials: {
        certificate,
        privateKey,
      },
      mspId,
      type: 'X.509',
    };

    // Store the identity in the wallet
    await wallet.put(identityLabel, identity);

    // Return a success response
    res.status(200).json({ message: 'Identity added to wallet successfully' });
  } catch (error) {
    // Handle errors and return an error response
    console.log('Error adding identity to wallet:', error);
    res.status(500).json({ error: 'An error occurred while adding identity to wallet' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});

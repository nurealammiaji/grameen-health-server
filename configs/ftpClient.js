const ftp = require('basic-ftp');

const ftpClient = new ftp.Client();
ftpClient.ftp.verbose = true;

const uploadFile = async (localPath, remotePath) => {
    try {
        await ftpClient.access({
            host: 'your-cpanel-host.com',
            user: 'your-ftp-username',
            password: 'your-ftp-password',
            secure: false
        });

        await ftpClient.uploadFrom(localPath, remotePath);
        console.log(`File uploaded to ${remotePath}`);
    } catch (error) {
        console.error('Error uploading file:', error);
    } finally {
        ftpClient.close();
    }
};

const deleteFile = async (remotePath) => {
    try {
        await ftpClient.access({
            host: 'your-cpanel-host.com',
            user: 'your-ftp-username',
            password: 'your-ftp-password',
            secure: false
        });

        await ftpClient.remove(remotePath);
        console.log(`File deleted from ${remotePath}`);
    } catch (error) {
        console.error('Error deleting file:', error);
    } finally {
        ftpClient.close();
    }
};

module.exports = { uploadFile, deleteFile };

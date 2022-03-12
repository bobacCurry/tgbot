module.exports = async (time) => {
	return new Promise((resolve, reject) => {
      	setTimeout(() => {
        	resolve();
      	}, time);
    })
}
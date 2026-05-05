async function run() {
  const appIds = [4570, 42960, 4000, 220, 10];
  const promises = appIds.map(async id => {
    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${id}&filters=price_overview,basic&cc=us`;
    const res = await fetch(steamUrl);
    return res.json();
  });
  const results = await Promise.all(promises);
  console.log(JSON.stringify(results, null, 2));
}
run();
export {};

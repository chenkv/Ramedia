export default function DashboardOption({ page }) {

  if (page == "Watchlist") {
    return (
      <div>Watchlist!</div>
    )
  }
  if (page == "Favorites") {
    return (
      <div>Favorites!</div>
    )
  }
  return (
    <div></div>
  )
}
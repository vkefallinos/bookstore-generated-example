import queryString from "query-string"
const removeBook = (params, credentials) => {
  return fetch("Book/$id" + "/" + params.id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t
    }
  })
    .then(response => {
      return response.json()
    })
    .catch(err => {
      console.log(err)
    })
}

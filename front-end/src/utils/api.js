/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

// const API_BASE_URL = "https://periodic-tables-back-end-md.herokuapp.com"
/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) => {
    key = key.replace('Displayed', '') //gets rid of the word 'displayed' thats passed in from params
    url.searchParams.append(key, value.toString())
  });
  const response = await fetchJson(url, { headers, signal }, [])
  return response
}

export async function readReservation(reservationId, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}`);
  const response = await fetchJson(url, { headers, signal }, []);
  response.reservation_date = response.reservation_date.slice(0, response.reservation_date.indexOf('T'));
  return response
}

export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, {headers, signal}, [])
}

export async function createTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function seatReservation(tableId, reservationId) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  const data = {
    reservation_id: reservationId
  }
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: data }),
  };
  return await fetchJson(url, options);
}

export async function reservationFinish(tableId, reservationId) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  const options = {
    method: 'DELETE',
    headers
  };
  return await fetchJson(url, options);
}

export async function changeStatus(reservationId, newStatus) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}/status`);
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: {status: newStatus}})
  };
  return await fetchJson(url, options);
}

export async function reservationUpdate(reservationId, reservationUpdated, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}`)
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: reservationUpdated })
  };
  return await fetchJson(url, options)
}

export async function reservationRemove(reservationId) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}`);
  const options = {
    method: 'DELETE',
    headers
  };
  return await fetchJson(url, options);
}

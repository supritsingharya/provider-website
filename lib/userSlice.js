import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { BASE_URL } from './endpoints'
import { getDeviceHeaders } from './deviceUtils'

// Create thunk to fecth dashboard data from API
export const fetchOtp = createAsyncThunk('fetchOtp', async (data, thunkAPI) => {
  console.log('🔵 fetchOtp - Starting with data:', data)

  // Validate input data
  if (!data || typeof data.number !== 'string' || data.number.trim() === '') {
    console.error('❌ fetchOtp - Invalid data provided:', data)
    throw new Error('Valid phone number string is required')
  }

  // Prepare url query string
  let url = `${BASE_URL}api/otp-apis/get/${data.number}`
  console.log('🔵 fetchOtp - Request URL:', url)

  try {
    // Make the request to the API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getDeviceHeaders(), // Add device information
        // 'Authorization': `Bearer ${token}`
      },
      redirect: 'follow',
      cache: 'default',
    })

    console.log('🔵 fetchOtp - Response status:', response.status)
    console.log('🔵 fetchOtp - Response ok:', response.ok)

    const result = await response.json()
    console.log('🔵 fetchOtp - Response data:', result)

    return result
  } catch (error) {
    console.error('❌ fetchOtp - Error occurred:', error)
    throw error
  }
})

export const submitOtp = createAsyncThunk(
  'submitOtp',
  async (data, thunkAPI) => {
    console.log('🟡 submitOtp - Starting with data:', data)

    // Validate input data
    if (
      !data ||
      typeof data.number !== 'string' ||
      data.number.trim() === '' ||
      typeof data.otp !== 'string' ||
      data.otp.trim() === ''
    ) {
      console.error('❌ submitOtp - Invalid data provided:', data)
      throw new Error('Valid phone number and OTP strings are required')
    }

    // Prepare url query string
    let url = `${BASE_URL}api/otp-apis/verify/${data.number}/${data.otp}`
    console.log('🟡 submitOtp - Request URL:', url)

    try {
      // Make the request to the API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getDeviceHeaders(), // Add device information
          // 'Authorization': `Bearer ${token}`
        },
        redirect: 'follow',
        cache: 'default',
      })

      console.log('🟡 submitOtp - Response status:', response.status)
      console.log('🟡 submitOtp - Response ok:', response.ok)

      const result = await response.json()
      console.log('🟡 submitOtp - Response data:', result)

      return result
    } catch (error) {
      console.error('❌ submitOtp - Error occurred:', error)
      throw error
    }
  }
)

export const fetchProfileMenu = createAsyncThunk(
  'fetchProfileMenu',
  async (data, thunkAPI) => {
    // Prepare url query string
    let url = `${BASE_URL}api/profile-menus?populate=*`

    // Make the request to the API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      redirect: 'follow',
      cache: 'default',
    })
    return response.json()
  }
)

export const submitUser = createAsyncThunk(
  'submitUser',
  async (data, thunkAPI) => {
    console.log('🟢 submitUser - Starting with data:', data)
    console.log('🟢 submitUser - Data type:', typeof data)
    console.log('🟢 submitUser - Data keys:', data ? Object.keys(data) : 'null')

    // If this is a direct login with JWT (from deep link)
    if (data && data.jwt && data.user && data.status === true) {
      console.log(
        '🟢 submitUser - Direct login detected, storing pre-authenticated user data'
      )
      console.log('🟢 submitUser - JWT present:', !!data.jwt)
      console.log('🟢 submitUser - User object:', data.user)
      // Just return the data without making an API call
      return data
    }

    // Otherwise, proceed with normal registration/login
    console.log('🟢 submitUser - Making API request to create user')

    // Validate input data for API call
    if (
      !data ||
      typeof data.name !== 'string' ||
      data.name.trim() === '' ||
      typeof data.number !== 'string' ||
      data.number.trim() === ''
    ) {
      console.error('❌ submitUser - Invalid data for API call:', data)
      throw new Error('Valid name and phone number strings are required')
    }

    // Prepare url query string
    let url = `${BASE_URL}api/otp-apis/create`
    console.log('🟢 submitUser - Request URL:', url)
    console.log('🟢 submitUser - Request body:', JSON.stringify(data))

    try {
      // Make the request to the API
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getDeviceHeaders(), // Add device information
          // 'Authorization': `Bearer ${token}`
        },
        redirect: 'follow',
        body: JSON.stringify(data),
      })

      console.log('🟢 submitUser - Response status:', response.status)
      console.log('🟢 submitUser - Response ok:', response.ok)

      const result = await response.json()
      console.log('🟢 submitUser - Response data:', result)

      return result
    } catch (error) {
      console.error('❌ submitUser - Error occurred:', error)
      throw error
    }
  }
)

export const getUserById = createAsyncThunk(
  'getUserById',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState()
    const token = state.user.userData?.jwt // Adjust the path based on your state structure
    // Prepare url query string
    let url = `${BASE_URL}api/users/${data.id}`

    // Make the request to the API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      redirect: 'follow',
    })
    return response.json()
  }
)

export const updateDeviceToken = createAsyncThunk(
  'updateDeviceToken',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState()
    const token = state.user.userData?.jwt // Adjust the path based on your state structure
    // Prepare url query string
    let url = `${BASE_URL}api/custom-fcm`
    // Make the request to the API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: state.user?.userData?.user?.id,
        token: data.token,
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to update device token')
    }
    return { token }
  }
)

export const updateUserById = createAsyncThunk(
  'getUserById',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState()
    const token = state.user.userData?.jwt // Adjust the path based on your state structure
    const { id, ...userData } = data
    // Prepare url query string
    let url = `${BASE_URL}api/users/${id}`

    // Make the request to the API
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      redirect: 'follow',
      body: JSON.stringify(userData),
    })
    return response.json()
  }
)

export const whatsappUser = createAsyncThunk(
  'whatsappUser',
  async (data, thunkAPI) => {
    try {
      // Check if the code looks like a verification token
      const isVerificationToken =
        data &&
        typeof data.code === 'string' && // Ensure data and data.code are valid strings
        data.code.trim() !== '' &&
        !data.code.includes('=') &&
        data.code.length > 3

      // Prepare url query string based on the type of code
      let url = isVerificationToken
        ? `${BASE_URL}api/whatsapp-auth-webhook/verify-token/${data.code.trim()}` // Trim code
        : `${BASE_URL}api/whatsapp-auth-webhook/verify-token` // This case might need re-evaluation if code is always expected

      console.log('WhatsApp verification URL:', url)

      // Make the request to the API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getDeviceHeaders(), // Add device information
        },
        redirect: 'follow',
      })

      // Check for error response
      if (!response.ok) {
        console.error(
          'WhatsApp verification failed:',
          response.status,
          response.statusText
        )

        // Try the test endpoint to see if the token exists
        const testUrl = `${BASE_URL}api/whatsapp-auth-webhook/test-token/${data.code}`
        console.log('Trying test endpoint:', testUrl)

        const testResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getDeviceHeaders(), // Add device information
          },
        })

        if (testResponse.ok) {
          const testData = await testResponse.json()
          console.log('Test endpoint result:', testData)
        }

        throw new Error(
          `API returned ${response.status}: ${response.statusText}`
        )
      }

      const data = await response.json()
      console.log('WhatsApp verification response:', data)
      return data
    } catch (error) {
      console.error('WhatsApp verification error:', error)
      throw error
    }
  }
)

// Async Thunk to log user data to CRM
export const logUserToCRM = createAsyncThunk(
  'user/logUserToCRM',
  async (data, { getState }) => {
    try {
      const state = getState()
      const token = data.token || state.user?.userData?.jwt // Prioritize passed token

      const url = `${BASE_URL}api/login-crm/log`
      console.log('Logging user to CRM:', url)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getDeviceHeaders(), // Add device information
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          data: {
            action: 'USER_LOGIN',
            userId: data.userId?.toString() || '',
            name: data.name || 'web',
            number: data.number || '',
            deviceInfo: JSON.stringify(getDeviceHeaders()),
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to log user data to CRM')
      }

      return await response.json()
    } catch (error) {
      console.error('Error logging to CRM:', error.message)
      // Don't reject the promise, just return an error object
      // This way, the app continues to work even if logging fails
      return { error: error.message }
    }
  }
)

// Fetch user's saved property IDs and sync with Redux state
export const fetchUserSavedPropertyIds = createAsyncThunk(
  'user/fetchSavedPropertyIds',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const token = state.user.userData?.jwt
      const userId = state.user.userData?.user?.id

      console.log('fetchUserSavedPropertyIds - userId:', userId)
      console.log('fetchUserSavedPropertyIds - token available:', !!token)

      if (!token || !userId) {
        return []
      }

      const url = `${BASE_URL}api/users/${userId}?populate=saved_properties`
      console.log('fetchUserSavedPropertyIds - url:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getDeviceHeaders(), // Add device information
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('fetchUserSavedPropertyIds - Error:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        })
        return rejectWithValue(
          `Failed to fetch saved properties: ${response.status} ${response.statusText}`
        )
      }

      const userData = await response.json()
      console.log('fetchUserSavedPropertyIds - userData:', userData)

      // Handle both data structures: direct array or nested data object
      const savedProperties =
        userData?.saved_properties?.data || userData?.saved_properties || []
      console.log(
        'fetchUserSavedPropertyIds - savedProperties:',
        savedProperties
      )

      // Extract just the IDs and normalize them to numbers
      const savedIds = savedProperties
        .map((prop) => {
          const id = prop.id || prop
          return parseInt(id)
        })
        .filter((id) => !isNaN(id)) // Filter out any invalid IDs

      console.log('fetchUserSavedPropertyIds - savedIds:', savedIds)
      return savedIds
    } catch (error) {
      console.error('fetchUserSavedPropertyIds - Unexpected error:', error)
      return rejectWithValue(error.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    otpStatus: null,
    userData: null,
    loading: false,
    error: null,
    userReferral: null,
    deviceToken: null,
    savedPropertyIds: [], // Add saved property IDs array
  },
  reducers: {
    logout: (state) => {
      state.otpStatus = null
      state.userData = null
      state.loading = false
      state.error = null
      state.deviceToken = null
      state.savedPropertyIds = [] // Clear saved properties on logout
    },
    setUserReferral: (state, action) => {
      state.userReferral = action.payload
    },
    setSavedPropertyIds: (state, action) => {
      state.savedPropertyIds = action.payload
    },
    toggleSavedProperty: (state, action) => {
      const propertyId = action.payload
      const index = state.savedPropertyIds.indexOf(propertyId)
      if (index > -1) {
        state.savedPropertyIds.splice(index, 1) // Remove if exists
      } else {
        state.savedPropertyIds.push(propertyId) // Add if doesn't exist
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtp.pending, (state) => {
        console.log('🔵 fetchOtp.pending - Setting loading to true')
        state.loading = true
        state.error = null
      })
      .addCase(fetchOtp.fulfilled, (state, action) => {
        console.log('🔵 fetchOtp.fulfilled - Payload received:', action.payload)
        console.log(
          '🔵 fetchOtp.fulfilled - Payload type:',
          typeof action.payload
        )
        state.loading = false
        state.otpStatus = action.payload
      })
      .addCase(fetchOtp.rejected, (state, action) => {
        console.log('🔵 fetchOtp.rejected - Error:', action.error)
        state.loading = false
        state.error = action.error.message
      })
      .addCase(submitOtp.pending, (state) => {
        console.log('🟡 submitOtp.pending - Setting loading to true')
        state.loading = true
        state.error = null
      })
      .addCase(submitOtp.fulfilled, (state, action) => {
        console.log(
          '🟡 submitOtp.fulfilled - Payload received:',
          action.payload
        )
        console.log(
          '🟡 submitOtp.fulfilled - Payload type:',
          typeof action.payload
        )
        console.log(
          '🟡 submitOtp.fulfilled - Payload keys:',
          action.payload ? Object.keys(action.payload) : 'null'
        )

        state.loading = false
        // Safely handle the payload to prevent undefined errors
        if (
          action.payload &&
          typeof action.payload === 'object' &&
          action.payload.jwt &&
          action.payload.user &&
          typeof action.payload.user === 'object'
        ) {
          console.log('🟡 submitOtp.fulfilled - Setting userData to payload')
          state.userData = action.payload
        } else {
          console.warn(
            '🟡 submitOtp.fulfilled - Invalid or incomplete payload, setting userData to null and error to true'
          )
          console.warn(
            'submitOtp fulfilled with invalid payload:',
            action.payload
          )
          state.userData = null
          state.error = 'Invalid OTP verification response from server.'
        }
      })
      .addCase(submitOtp.rejected, (state, action) => {
        console.log('🟡 submitOtp.rejected - Error:', action.error)
        state.loading = false
        state.error = action.error.message
      })
      .addCase(whatsappUser.pending, (state) => {
        console.log('🟣 whatsappUser.pending - Setting loading to true')
        state.loading = true
        state.error = null
      })
      .addCase(whatsappUser.fulfilled, (state, action) => {
        console.log(
          '🟣 whatsappUser.fulfilled - Payload received:',
          action.payload
        )
        console.log(
          '🟣 whatsappUser.fulfilled - Payload type:',
          typeof action.payload
        )
        state.loading = false
        // Safely handle the payload for whatsappUser
        if (
          action.payload &&
          typeof action.payload === 'object' &&
          action.payload.status
        ) {
          // Check for status as per existing logic
          if (
            action.payload.jwt &&
            action.payload.user &&
            typeof action.payload.user === 'object'
          ) {
            console.log(
              '🟣 whatsappUser.fulfilled - JWT and user found, setting userData'
            )
            state.userData = action.payload
          } else if (action.payload.msg === 'USER_NOT_FOUND') {
            console.log(
              '🟣 whatsappUser.fulfilled - User not found, payload kept for navigation'
            )
            state.userData = action.payload // Keep payload for navigation logic in component
          } else {
            console.warn(
              '🟣 whatsappUser.fulfilled - Payload status OK, but missing JWT/user or specific msg, setting userData to payload for now'
            )
            state.userData = action.payload // Or set to null and handle error if this state is unexpected
          }
        } else {
          console.warn(
            '🟣 whatsappUser.fulfilled - Invalid or incomplete payload, setting userData to null and error to true'
          )
          console.warn(
            'whatsappUser fulfilled with invalid payload:',
            action.payload
          )
          state.userData = null
          state.error = 'Invalid WhatsApp verification response from server.'
        }
      })
      .addCase(whatsappUser.rejected, (state, action) => {
        console.log('🟣 whatsappUser.rejected - Error:', action.error)
        state.loading = false
        state.error = action.error.message
      })
      .addCase(submitUser.pending, (state) => {
        console.log('🟢 submitUser.pending - Setting loading to true')
        state.loading = true
        state.error = null
      })
      .addCase(submitUser.fulfilled, (state, action) => {
        console.log(
          '🟢 submitUser.fulfilled - Payload received:',
          action.payload
        )
        console.log(
          '🟢 submitUser.fulfilled - Payload type:',
          typeof action.payload
        )
        console.log(
          '🟢 submitUser.fulfilled - Payload keys:',
          action.payload ? Object.keys(action.payload) : 'null'
        )

        state.loading = false
        // Safely handle the payload to prevent undefined errors
        if (action.payload && typeof action.payload === 'object') {
          // Check if the payload contains the expected user data structure (JWT and user object)
          // or if it's a direct pass-through from a deep link (already has .user and .jwt)
          if (
            action.payload.jwt &&
            action.payload.user &&
            typeof action.payload.user === 'object'
          ) {
            console.log(
              '🟢 submitUser.fulfilled - Valid JWT and user found, setting userData'
            )
            state.userData = action.payload
          } else if (
            action.payload.error &&
            typeof action.payload.error === 'object'
          ) {
            console.log(
              '🟢 submitUser.fulfilled - Error in payload:',
              action.payload.error
            )
            state.error =
              action.payload.error.message ||
              'Server error during user submission.'
            state.userData = null // Ensure userData is cleared on error
          } else if (action.payload.msg === 'USER_NOT_FOUND') {
            // Handle specific messages like USER_NOT_FOUND
            console.log(
              '🟢 submitUser.fulfilled - User not found, payload kept for component logic'
            )
            state.userData = action.payload // Keep payload for screen navigation logic in component
          } else {
            // Handle case where payload exists but doesn't match expected structure or known messages
            console.warn(
              '🟢 submitUser.fulfilled - Unexpected payload structure, setting userData to null and error'
            )
            console.warn(
              'submitUser fulfilled with unexpected payload structure:',
              action.payload
            )
            state.userData = null
            state.error = 'Unexpected response structure from server.'
          }
        } else {
          console.warn(
            '🟢 submitUser.fulfilled - Invalid payload (null or not an object), setting userData to null and error'
          )
          console.warn(
            'submitUser fulfilled with invalid payload:',
            action.payload
          )
          state.userData = null
          state.error = 'Invalid response from server.'
        }
      })
      .addCase(submitUser.rejected, (state, action) => {
        console.log('🟢 submitUser.rejected - Error:', action.error)
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateDeviceToken.fulfilled, (state, action) => {
        console.log(
          '📱 updateDeviceToken.fulfilled - Token updated:',
          action.payload.token
        )
        state.loading = false
        state.deviceToken = action.payload.token
      })
      // Handle fetchUserSavedPropertyIds
      .addCase(fetchUserSavedPropertyIds.fulfilled, (state, action) => {
        state.savedPropertyIds = action.payload
      })
      // Handle toggleSaveProperty from properties.js
      .addMatcher(
        (action) => action.type === 'property/toggleSave/fulfilled',
        (state, action) => {
          const { propertyId, isSaved } = action.payload
          const normalizedPropertyId = parseInt(propertyId)
          const index = state.savedPropertyIds.indexOf(normalizedPropertyId)

          console.log('Redux matcher - toggleSave fulfilled:', {
            propertyId,
            normalizedPropertyId,
            isSaved,
            index,
            currentSavedIds: state.savedPropertyIds,
          })

          if (isSaved && index === -1) {
            // Add property if it's saved and not in the array
            state.savedPropertyIds.push(normalizedPropertyId)
          } else if (!isSaved && index > -1) {
            // Remove property if it's unsaved and in the array
            state.savedPropertyIds.splice(index, 1)
          }

          console.log(
            'Redux matcher - updated savedPropertyIds:',
            state.savedPropertyIds
          )
        }
      )
  },
})

export const {
  logout,
  setUserReferral,
  setSavedPropertyIds,
  toggleSavedProperty,
} = userSlice.actions

export default userSlice.reducer

import { createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from './endpoints'
import { logUserToCRM } from './userSlice'
import axios from 'axios'

// Create thunk to fetch properties from API
export const fetchProperties = createAsyncThunk(
    'fetchProperties',
    async (
        {
            cityId,
            genderId,
            limit = 10,
            start = 0,
            propertyType,
            collegeId,
            locationId,
            searchParam = null,
            tag = null,
        },
        thunkAPI
    ) => {
        // Construct the query string dynamically
        const url = new URL(`${BASE_URL}api/properties`)
        const params = {
            'populate[genders]': true,
            'populate[property_pricing][populate][price_json]': true,
            'populate[facilities][fields]': 'value',
            'populate[images][fields]': 'url',
            'pagination[limit]': limit,
            'pagination[start]': start,
            //sort by ranking_id in descending order
            sort: 'ranking_id:desc',
            'filters[ranking_id][$notNull]': 'true',
            'filters[ranking_id][$notIn][0]': '00',
            'filters[ranking_id][$notIn][1]': '000',
            'filters[ranking_id][$notIn][2]': '0000',
            //sort: 'name:asc',
        }

        // Only add city filter if cityId is provided
        if (cityId) {
            params['filters[city][id][$eq]'] = cityId
            // Only add location filter if locationId is provided
            if (locationId) {
                params['filters[location][id][$eq]'] = locationId
            }
        }

        if (searchParam) {
            // why need neeed space to search . like 'Flat' or 'Flat ' have different respone

            params['filters[$or][3][property_types]'] = searchParam
            params['filters[$or][0][name][$contains]'] = searchParam
            params['filters[$or][1][location][name][$contains]'] = searchParam
            params['filters[$or][2][city][name][$contains]'] = searchParam
        }

        if (tag) {
            params['filters[$and][0][tags][name][$contains]'] = tag?.attributes?.name
        }

        // Conditionally add the gender filter if genderId is provided
        if (genderId) {
            params['filters[genders][id][$eq]'] = genderId
        }

        if (propertyType) {
            params['filters[property_types][$eq]'] = propertyType
        }

        if (collegeId) {
            params['filters[collage][id][$eq]'] = collegeId
        }

        // Add the params to the URL
        Object.keys(params).forEach((key) =>
            url.searchParams.append(key, params[key])
        )

        console.log('Fetching properties from URL:', url.toString())

        // Make the request to the API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            cache: 'default',
        })

        // Check for response status and handle errors
        if (!response.ok) {
            return thunkAPI.rejectWithValue(await response.json())
        }

        return response.json()
    }
)

export const fetchPropertyDetails = createAsyncThunk(
    'fetchPropertyDetails',
    async ({ propertyId }, thunkAPI) => {
        const state = thunkAPI.getState()
        const token = state.user.userData.jwt // Get the token from the user state
        // Prepare URL with city data included
        const url = `${BASE_URL}api/properties/${propertyId}?populate[2]=genders&populate[3]=facilities.image&populate[0]=property_pricing.price_json&populate[1]=images&populate=*&populate[4]=premiumVisit&populate[5]=city`
        console.log('Fetching property details from URL:', url)

        // Make the request to the API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            redirect: 'follow',
            cache: 'default',
        })

        // console.log('Property details response:', response)

        if (!response.ok) {
            return thunkAPI.rejectWithValue(await response.json())
        }

        return response.json()
    }
)

export const fetchComplaints = createAsyncThunk(
    'fetchComplaints',
    async (id, thunkAPI) => {
        // Prepare URL
        let url = ''
        if (id) {
            url = `${BASE_URL}api/complaint-types/${id}?populate[complaint_sub_types][populate][ComplaintIssue]=*&populate[icon]=*`
        } else {
            url = `${BASE_URL}api/complaint-types?populate=*`
        }

        // Make the request to the API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': `Bearer ${token}`
            },
            redirect: 'follow',
            cache: 'default',
        })

        if (!response.ok) {
            return thunkAPI.rejectWithValue(await response.json())
        }

        return response.json()
    }
)

export const fetchMyComplaints = createAsyncThunk(
    'fetchMyComplaints',
    async ({ limit = 10, start = 0, userId: argUserId, token: argToken }, { rejectWithValue, getState }) => {
        // Construct the query string dynamically
        const state = getState()
        const token = argToken || state.user.userData.jwt // Get the token from the user state
        const userId = argUserId || state.user.userData.user.id
        const url = `${BASE_URL}api/complaints`
        const params = new URLSearchParams({
            'pagination[limit]': limit,
            'pagination[start]': start,
            sort: 'id:asc',
            populate: '*',
            'filters[users_permissions_user][id][$eq]': userId
        })

        const finalUrl = `${url}?${params.toString()}`
        console.log(finalUrl)
        // Make the request to the API
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            redirect: 'follow',
            cache: 'default',
        })

        // Check for response status and handle errors
        if (!response.ok) {
            return rejectWithValue(await response.json())
        }
        // console.log(response.json())
        return response.json()
    }
)

export const fetchTimeSlots = createAsyncThunk(
    'fetchTimeSlots',
    async (data, { rejectWithValue, getState }) => {
        // Prepare URL
        const url = `${BASE_URL}api/slot-availabilities?populate=*&filters[date][$eq]=${data.date}`
        const state = getState()
        const token = state.user.userData.jwt // Get the token from the user state

        // Make the request to the API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${token}`,
            },
            redirect: 'follow',
            cache: 'default',
        })

        if (!response.ok) {
            return rejectWithValue(await response.json())
        }

        return response.json()
    }
)

export const fetchSeaters = createAsyncThunk(
    'fetchSeaters',
    async (thunkAPI) => {
        // Prepare URL
        const url = `${BASE_URL}api/seaters`

        // Make the request to the API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': `Bearer ${token}`
            },
            redirect: 'follow',
            cache: 'default',
        })

        if (!response.ok) {
            return thunkAPI.rejectWithValue(await response.json())
        }

        return response.json()
    }
)

export const fetchVisitDesc = createAsyncThunk(
    'fetchVisitDesc',
    async (thunkAPI) => {
        // Prepare URL
        const url = `${BASE_URL}api/visit-description`

        // Make the request to the API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': `Bearer ${token}`
            },
            redirect: 'follow',
            cache: 'default',
        })

        if (!response.ok) {
            return thunkAPI.rejectWithValue(await response.json())
        }

        return response.json()
    }
)

export const postPropertyVisit = createAsyncThunk(
    'postPropertyVisit',
    async ({ userId, propertyId }, thunkAPI) => {
        const url = `${BASE_URL}api/views`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    property: propertyId,
                    user: userId,
                },
            }),
        })

        if (!response.ok) {
            return thunkAPI.rejectWithValue(await response.json())
        }

        return response.json()
    }
)

// Function to send WhatsApp message using MSG91 API
const sendWhatsAppNotification = async (propertyData, userData) => {
    const message = `New Property Listing:
Name: ${propertyData.name}
Property Type: ${propertyData.property_types}
Owner Number: ${propertyData.owner_number}
User Number: ${userData.username || userData.email}
City: ${propertyData.city}
Location: ${propertyData.location}`

    try {
        // MSG91 WhatsApp API configuration
        const msg91Config = {
            method: 'POST',
            url: 'https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/',
            headers: {
                authkey: '395515A9MNXTFCjT67ed84c1P1',
                'Content-Type': 'application/json',
            },
            data: {
                integrated_number: '918383809410',
                content_type: 'text',
                recipient_number: '919266574277', // Verification team number
                text: message,
            },
        }

        // Alternative format using template
        const alternativeConfig = {
            method: 'POST',
            url: 'https://control.msg91.com/api/v5/whatsapp/campaign/send',
            headers: {
                authkey: '395515A9MNXTFCjT67ed84c1P1',
                'Content-Type': 'application/json',
            },
            data: {
                template_id: 'property_listing', // You'll need to create this template in MSG91
                recipients: [
                    {
                        mobiles: '919266574277',
                        var_values: [
                            propertyData.name,
                            propertyData.property_types,
                            propertyData.owner_number,
                            userData.username || userData.email,
                            propertyData.city,
                            propertyData.location,
                        ],
                    },
                ],
            },
        }

        // Try to send the message with retry mechanism
        let retryCount = 0
        const maxRetries = 3

        const sendMessage = async () => {
            try {
                const response = await axios(msg91Config)
                console.log('WhatsApp notification sent successfully:', response.data)
                return response
            } catch (error) {
                console.error(
                    'WhatsApp API error:',
                    error.response?.data || error.message
                )

                if (retryCount < maxRetries) {
                    retryCount++
                    console.log(`Retrying... (${retryCount}/${maxRetries})`)
                    return await sendMessage()
                } else {
                    console.log('Max retries reached, trying alternative format')
                    // Try alternative format
                    const altResponse = await axios(alternativeConfig)
                    console.log(
                        'Alternative WhatsApp notification sent:',
                        altResponse.data
                    )
                    return altResponse
                }
            }
        }

        await sendMessage()
    } catch (error) {
        console.error('Failed to send WhatsApp notification:', error)
    }
}

export const postProperty = createAsyncThunk(
    'property/post',
    async (data, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState()
            const token = data.token || state.user?.userData?.jwt
            const userData = data.userData || state.user?.userData?.user

            // Remove auth data from payload if present
            const { token: _t, userData: _u, ...propertyData } = data;

            if (!token) {
                return rejectWithValue("Authentication token missing")
            }

            const response = await fetch(`${BASE_URL}api/properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ data: { ...propertyData, publishedAt: null } }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                return rejectWithValue(errorText)
            }

            const result = await response.json()

            // Send WhatsApp notification
            if (userData) {
                await sendWhatsAppNotification(propertyData, userData)

                // Log to CRM
                dispatch(
                    logUserToCRM({
                        userId: userData.id,
                        action: 'NEW_LISTING',
                        propertyId: result.data.id,
                        number: userData.username || userData.email,
                        propertyData: {
                            name: propertyData.name,
                            propertyType: propertyData.property_types,
                            ownerNumber: propertyData.owner_number,
                            city: propertyData.city,
                            location: propertyData.location,
                        },
                    })
                )
            }

            return result
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const postComplaints = createAsyncThunk(
    'postComplaints',
    async (data, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const token = data.token || state.user?.userData?.jwt // Get the token from the user state or data arg
            // Remove token from data object before sending if it was added there for transport
            const { token: _, ...complaintData } = data;

            let response
            console.log(complaintData)
            if (complaintData.id) {
                response = await fetch(`${BASE_URL}api/complaints/${complaintData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Add the token to the request headers
                    },
                    body: JSON.stringify({ data: complaintData }),
                })
            } else {
                response = await fetch(`${BASE_URL}api/complaints`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Add the token to the request headers
                    },
                    body: JSON.stringify({ data: complaintData }), // Wrapped in data object to match Strapi format
                })
            }

            if (!response.ok) {
                const errorText = await response.text()
                return rejectWithValue(errorText)
            }

            const result = await response.json()
            return result
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createPropertyBook = createAsyncThunk(
    'createPropertyBook',
    async (
        { amount, pricing, propertyId, raz_order_id },
        { rejectWithValue, getState }
    ) => {
        // Prepare url query string for Razorpay order
        const razorpayUrl = 'https://api.razorpay.com/v1/orders'
        const keyId = 'rzp_live_8cJnVP96G6dCeR'
        const keySecret = 'aPZ72HlF5ib9c5XWKBBOOTIa'
        const credentials = btoa(`${keyId}:${keySecret}`)
        const state = getState()
        const token = state.user.userData.jwt // Get the token from the user state
        const userId = state.user.userData.user.id

        const orderData = {
            amount: amount * 100,
            currency: 'INR',
            receipt: new Date().toISOString(),
            partial_payment: false,
            notes: {
                key1: 'Security Deposit',
            },
        }

        const razorpayResponse = await fetch(razorpayUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${credentials}`,
            },
            body: JSON.stringify(orderData),
        })

        if (!razorpayResponse.ok) {
            const message = `An error has occurred: ${razorpayResponse.statusText}`
            throw new Error(message)
        }

        const razorpayData = await razorpayResponse.json()
        const orderId = razorpayData.id
        // Prepare url query string for stationery order
        const url = `${BASE_URL}api/property-bookeds`

        const stationeryOrderData = {
            data: {
                property: propertyId,
                user: userId,
                raz_order_id: orderId,
                payment_status: {
                    status: 'created',
                },
                selected_pricing: pricing,
            },
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
            body: JSON.stringify(stationeryOrderData),
        })

        if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`
            throw new Error(message)
        }

        const bookedData = await response.json()
        return { razorpayData, bookedData }
    }
)

export const updateBookedStatus = createAsyncThunk(
    'updateBookedStatus',
    async ({ paymentId, orderId, cancelled }, { rejectWithValue, getState }) => {
        const state = getState()
        const token = state.user.userData.jwt // Get the token from the user state
        const userId = state.user.userData.user.id
        const orderUrl = `${BASE_URL}api/property-bookeds/${orderId}`

        let orderData = {}

        if (!cancelled) {
            orderData = {
                data: {
                    raz_payment_id: paymentId,
                    payment_status: {
                        status: 'paid',
                    },
                },
            }
        } else {
            orderData = {
                data: {
                    payment_status: {
                        status: 'payment cancel',
                    },
                },
            }
        }

        const orderResponse = await fetch(orderUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
            body: JSON.stringify(orderData),
        })

        if (!orderResponse.ok) {
            const message = `An error has occurred: ${orderResponse.statusText}`
            throw new Error(message)
        }

        return await orderResponse.json()
    }
)

export const fetchMyBookings = createAsyncThunk(
    'fetchMyBookings',
    async ({ userId: argUserId, token: argToken }, { rejectWithValue, getState }) => {
        const state = getState()
        const token = argToken || state.user?.userData?.jwt
        const id = argUserId || state.user?.userData?.user?.id

        // Fetch properties booked by the user
        // We filter by user ID and ensure payment status is 'paid' or 'created' (depending on business logic, assuming 'paid' for active tenants)
        // Adjust filter as needed. For now, just fetching all bookings for the user.
        const url = `${BASE_URL}api/property-bookeds?filters[user][id][$eq]=${id}&populate[property][populate][0]=images&populate[property][populate][1]=location&populate[property][populate][2]=city`

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                const errorText = await response.text()
                return rejectWithValue(errorText)
            }

            return await response.json()
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// Free visit
export const BookFreeVisit = createAsyncThunk(
    'BookFreeVisit',
    async (data, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const token = state.user.userData.jwt // Get the token from the user state

            console.log('BookFreeVisit - Request data:', JSON.stringify(data))
            console.log('BookFreeVisit - User JWT available:', !!token)

            const response = await fetch(`${BASE_URL}api/schedule-visits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add the token to the request headers
                },
                body: JSON.stringify({ data: { ...data } }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('BookFreeVisit - API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText,
                })

                // Try to parse the error text as JSON for more details
                let errorDetails
                try {
                    errorDetails = JSON.parse(errorText)
                    console.error('BookFreeVisit - Error details:', errorDetails)
                } catch (e) {
                    console.error('BookFreeVisit - Error text:', errorText)
                }

                return rejectWithValue({
                    status: response.status,
                    message: response.statusText,
                    details: errorDetails || errorText,
                })
            }

            const result = await response.json()
            console.log('BookFreeVisit - Success response:', result)
            return result
        } catch (error) {
            console.error('BookFreeVisit - Unexpected error:', error)
            return rejectWithValue({
                message: error.message,
                stack: error.stack,
            })
        }
    }
)

export const createPremiumVisitOrder = createAsyncThunk(
    'createPremiumVisitOrder',
    async ({ data }, { rejectWithValue, getState }) => {
        try {
            // Prepare url query string for Razorpay order
            const razorpayUrl = 'https://api.razorpay.com/v1/orders'
            const keyId = 'rzp_live_8cJnVP96G6dCeR'
            const keySecret = 'aPZ72HlF5ib9c5XWKBBOOTIa'
            const credentials = btoa(`${keyId}:${keySecret}`)
            const state = getState()
            const token = state.user.userData?.jwt // Get the token from the user state
            const userId = state.user.userData?.user?.id

            if (!token || !userId) {
                throw new Error('User authentication required. Please login again.')
            }

            if (!data.amount || data.amount <= 0) {
                throw new Error('Invalid visit amount.')
            }

            if (!data.property || !data.time_slot || !data.visitDate) {
                throw new Error(
                    'Invalid visit details. Please check your booking information.'
                )
            }

            const orderData = {
                amount: data.amount * 100,
                currency: 'INR',
                receipt: new Date().toISOString(),
                partial_payment: false,
                notes: {
                    key1: 'Premium Visit',
                    key2: 'Provider App',
                },
            }

            console.log(
                'Creating Razorpay order for premium visit with amount:',
                data.amount * 100
            )

            const razorpayResponse = await fetch(razorpayUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${credentials}`,
                },
                body: JSON.stringify(orderData),
            })

            if (!razorpayResponse.ok) {
                const errorText = await razorpayResponse.text()
                console.error('Razorpay API Error:', {
                    status: razorpayResponse.status,
                    statusText: razorpayResponse.statusText,
                    errorText: errorText,
                })

                let errorMessage = 'Payment gateway error. Please try again.'
                if (razorpayResponse.status === 401) {
                    errorMessage =
                        'Payment gateway authentication failed. Please contact support.'
                } else if (razorpayResponse.status === 400) {
                    errorMessage =
                        'Invalid payment request. Please check your visit details.'
                }

                throw new Error(errorMessage)
            }

            const razorpayData = await razorpayResponse.json()
            const orderId = razorpayData.id
            // Prepare url query string for visit order
            const url = `${BASE_URL}api/schedule-visits`

            const visitOrder = {
                data: {
                    raz_order_id: orderId,
                    paymentStatus: 'pending',
                    ...data,
                },
            }

            console.log(
                'Creating premium visit order with data:',
                JSON.stringify(visitOrder, null, 2)
            )

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Add the token to the request headers
                },
                body: JSON.stringify(visitOrder),
            })

            if (!response.ok) {
                const errorText = await response.text()
                const message = `Premium Visit API error: ${response.status} ${response.statusText} - ${errorText}`
                console.error(
                    'Premium visit order data:',
                    JSON.stringify(visitOrder, null, 2)
                )
                throw new Error(message)
            }

            const bookedData = await response.json()
            return { razorpayData, bookedData }
        } catch (error) {
            console.error('CreatePremiumVisitOrder error:', error)
            throw error
        }
    }
)

export const updateVisitBookedStatus = createAsyncThunk(
    'updateVisitBookedStatus',
    async (
        { paymentId, orderId, cancelled, failed },
        { rejectWithValue, getState }
    ) => {
        const state = getState()
        const token = state.user.userData.jwt // Get the token from the user state
        const userId = state.user.userData.user.id
        const orderUrl = `${BASE_URL}api/schedule-visits/${orderId}`

        let orderData = {}

        if (!cancelled && !failed) {
            orderData = {
                data: {
                    raz_payment_id: paymentId,
                    paymentStatus: 'completed',
                },
            }
        } else if (failed) {
            orderData = {
                data: {
                    paymentStatus: 'failed',
                },
            }
        } else {
            orderData = {
                data: {
                    paymentStatus: 'cancelled',
                },
            }
        }

        const orderResponse = await fetch(orderUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
            body: JSON.stringify(orderData),
        })

        if (!orderResponse.ok) {
            const message = `An error has occurred: ${orderResponse.statusText}`
            throw new Error(message)
        }

        return await orderResponse.json()
    }
)

// Toggle property save (add to wishlist or remove)
export const toggleSaveProperty = createAsyncThunk(
    'property/toggleSave',
    async ({ propertyId, token: argToken, userId: argUserId }, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const authToken = argToken || state.user?.userData?.jwt
            const userIdFromState = state.user?.userData?.user?.id

            // Prioritize userId from arguments, then state
            const currentUserId = argUserId || userIdFromState

            // If we have no token or userId at all, fail
            if (!authToken || !currentUserId) {
                console.warn("toggleSaveProperty: Missing auth info (token or userId)")
                return rejectWithValue('User must be logged in to save properties')
            }

            console.log(
                'toggleSaveProperty - propertyId:',
                propertyId,
                'type:',
                typeof propertyId
            )
            console.log('toggleSaveProperty - token available:', !!authToken)

            if (!authToken || !currentUserId) {
                return rejectWithValue('User must be logged in to save properties')
            }

            // Ensure propertyId is a number for consistent comparison
            const normalizedPropertyId = parseInt(propertyId)
            if (isNaN(normalizedPropertyId)) {
                return rejectWithValue('Invalid property ID')
            }

            // First check if property is already saved by the user
            const checkUrl = `${BASE_URL}api/users/${currentUserId}?populate=saved_properties`
            console.log('toggleSaveProperty - checkUrl:', checkUrl)

            const checkResponse = await fetch(checkUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            })

            if (!checkResponse.ok) {
                const errorText = await checkResponse.text()
                console.error('toggleSaveProperty - Check response error:', {
                    status: checkResponse.status,
                    statusText: checkResponse.statusText,
                    errorText,
                })
                return rejectWithValue(
                    `Failed to check saved properties: ${checkResponse.status} ${checkResponse.statusText}`
                )
            }

            const userData = await checkResponse.json()
            console.log('toggleSaveProperty - userData:', userData)

            // Handle both data structures: direct array or nested data object
            const savedProperties =
                userData.saved_properties?.data || userData.saved_properties || []
            console.log('toggleSaveProperty - savedProperties:', savedProperties)

            // Check if property is already saved (handle both ID types)
            const isAlreadySaved = savedProperties.some((prop) => {
                const propId = prop.id || prop
                return parseInt(propId) === normalizedPropertyId
            })

            console.log('toggleSaveProperty - isAlreadySaved:', isAlreadySaved)

            // Update user's saved properties
            const updateUrl = `${BASE_URL}api/users/${currentUserId}`
            const updateData = {
                saved_properties: isAlreadySaved
                    ? savedProperties.filter((prop) => {
                        const propId = prop.id || prop
                        return parseInt(propId) !== normalizedPropertyId
                    })
                    : [...savedProperties, normalizedPropertyId], // Store as number for consistency
            }

            console.log('toggleSaveProperty - updateData:', updateData)

            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(updateData),
            })

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text()
                console.error('toggleSaveProperty - Update response error:', {
                    status: updateResponse.status,
                    statusText: updateResponse.statusText,
                    errorText,
                })
                return rejectWithValue(
                    `Failed to update saved properties: ${updateResponse.status} ${updateResponse.statusText}`
                )
            }

            const result = await updateResponse.json()
            console.log('toggleSaveProperty - Update result:', result)

            return {
                isSaved: !isAlreadySaved,
                propertyId: normalizedPropertyId,
            }
        } catch (error) {
            console.error('toggleSaveProperty - Unexpected error:', error)
            return rejectWithValue(error.message)
        }
    }
)

// Fetch user's saved properties
export const fetchSavedProperties = createAsyncThunk(
    'property/fetchSaved',
    async (payload = {}, { rejectWithValue, getState }) => {
        try {
            const { userId: argUserId, token: argToken } = payload || {};
            const state = getState()
            const token = argToken || state.user?.userData?.jwt
            const userId = argUserId || state.user?.userData?.user?.id

            if (!token || !userId) {
                return rejectWithValue(
                    'User must be logged in to fetch saved properties'
                )
            }

            // Get user's saved properties
            // Get user's saved properties
            const url = `${BASE_URL}api/users/${userId}?populate[saved_properties][populate][0]=genders&populate[saved_properties][populate][1]=property_pricing.price_json&populate[saved_properties][populate][2]=facilities.image&populate[saved_properties][populate][3]=images&populate[saved_properties][populate][4]=seaters`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                return rejectWithValue('Failed to fetch saved properties')
            }

            const userData = await response.json()

            // Handle Strapi response structure flexibly
            // userData.saved_properties might be { data: [...] } or just [...]
            let savedProps = []
            if (userData.saved_properties) {
                if (Array.isArray(userData.saved_properties)) {
                    savedProps = userData.saved_properties
                } else if (userData.saved_properties.data && Array.isArray(userData.saved_properties.data)) {
                    savedProps = userData.saved_properties.data
                }
            }

            return {
                data: savedProps,
                meta: {
                    pagination: {
                        total: savedProps.length,
                    },
                },
            }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// Reveal Property
export const revealProperty = createAsyncThunk(
    'revealProperty',
    async (data, { rejectWithValue, getState, dispatch }) => {
        const state = getState()

        // Parse the data first
        const parsedData = JSON.parse(data)
        const passedToken = parsedData.token; // Check if token is inside the data package
        const passedUserId = parsedData.data.users_permissions_user;

        const userId = passedUserId || state.user?.userData?.user?.id
        const token = passedToken || state.user?.userData?.jwt

        // Use the same endpoint that works in Postman
        const revealUrl = `${BASE_URL}api/reveal-properties`

        try {
            const propertyId = parsedData.data.property
            const action = parsedData.data.action

            // Debug logs
            console.log('Reveal property request to:', revealUrl)
            console.log('Reveal property data:', data)

            // Log to CRM
            dispatch(
                logUserToCRM({
                    userId,
                    action: `PROPERTY_REVEALED_${action}`,
                    propertyId,
                    token: token, // Pass token to logUserToCRM
                    // Fallbacks for name/number if not in state
                    name: state.user?.userData?.user?.username || 'Web User',
                    number: state.user?.userData?.user?.email || 'web-user',
                })
            )

            // Match the exact Postman request (no Authorization header for reveal-properties call itself based on previous code, but typically Strapi needs it. 
            // The previous verification code DID NOT use auth header for the reveal endpoint itself, relying on LogUserToCRM separately?
            // Actually, looking at previous code: "Match the exact Postman request (no Authorization header)" is explicitly commented.
            // So we just stick to that.

            const revealResponse = await fetch(revealUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // Add Authorization if token exists, just in case, heavily recommended for Strapi
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: data,
            })

            console.log('Reveal property response status:', revealResponse.status)

            if (!revealResponse.ok) {
                let errorData
                try {
                    errorData = await revealResponse.json()
                } catch (e) {
                    errorData = {
                        message: revealResponse.statusText || 'Unknown error',
                        status: revealResponse.status,
                    }
                }

                console.log('Reveal property error details:', JSON.stringify(errorData))
                return rejectWithValue({
                    ...errorData,
                    status: revealResponse.status,
                })
            }

            const responseData = await revealResponse.json()
            console.log('Reveal property success:', JSON.stringify(responseData))
            return responseData
        } catch (error) {
            console.error('Reveal property error:', error)
            return rejectWithValue(error.message)
        }
    }
)

export const fetchMyScheduledVisits = createAsyncThunk(
    'property/fetchMyScheduledVisits',
    async (payload = {}, { rejectWithValue, getState }) => {
        try {
            const { userId: argUserId, token: argToken } = payload || {};
            const state = getState()
            const token = argToken || state.user?.userData?.jwt
            const userId = argUserId || state.user?.userData?.user?.id

            if (!token || !userId) {
                return rejectWithValue('User must be logged in to fetch scheduled visits')
            }

            const url = new URL(`${BASE_URL}api/schedule-visits`)
            const params = {
                'filters[users_permissions_user][id][$eq]': userId,
                'populate[property][populate][images][fields]': 'url',
                'populate[property][populate][location]': '*',
                'populate[property][populate][city]': '*',
                'sort': 'visitDate:desc'
            }

            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

            console.log('Fetching scheduled visits:', url.toString())

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                return rejectWithValue('Failed to fetch scheduled visits')
            }

            const data = await response.json()
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const uploadImage = createAsyncThunk(
    'images/upload',
    async ({ images, token: tokenFromArgs }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const token = tokenFromArgs || state.user?.userData?.jwt;

            // In web, we typically use FormData for file uploads
            // images should be an array of File objects or similar
            const formData = new FormData();

            // If images is an array of files
            if (Array.isArray(images)) {
                images.forEach((file) => {
                    formData.append('files', file);
                });
            } else {
                // Single file
                formData.append('files', images);
            }

            const response = await fetch(`${BASE_URL}api/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Content-Type is set automatically with FormData
                },
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 413) {
                    return rejectWithValue("File is too large. Please upload a smaller image (under 5MB).");
                }
                const errorText = await response.text();
                return rejectWithValue(errorText);
            }

            const result = await response.json();
            return result; // Should be array of uploaded file objects with IDs
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchFacilities = createAsyncThunk(
    'property/fetchFacilities',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}api/facilities?populate=*`);
            if (!response.ok) {
                return rejectWithValue(await response.text());
            }
            const result = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAllSeaterTypes = createAsyncThunk(
    'property/fetchAllSeaterTypes',
    async (_, { rejectWithValue }) => {
        try {
            // Assuming endpoint is 'seaters' based on mobile app naming conventions
            const response = await fetch(`${BASE_URL}api/seaters?populate=*`);
            if (!response.ok) {
                return rejectWithValue(await response.text());
            }
            const result = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

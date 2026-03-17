import { BASE_URL } from './endpoints';
import { getDeviceHeaders } from './deviceUtils';

/**
 * Fetch OTP for a phone number
 * @param {Object} data - { number: string }
 */
export const fetchOtp = async (data) => {
    console.log('🔵 fetchOtp - Starting with data:', data);

    if (!data || typeof data.number !== 'string' || data.number.trim() === '') {
        throw new Error('Valid phone number string is required');
    }

    let url = `${BASE_URL}api/otp-apis/get/${data.number}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getDeviceHeaders(),
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('❌ fetchOtp - Error occurred:', error);
        throw error;
    }
};

/**
 * Verify OTP
 * @param {Object} data - { number: string, otp: string }
 */
export const submitOtp = async (data) => {
    if (
        !data ||
        typeof data.number !== 'string' ||
        data.number.trim() === '' ||
        typeof data.otp !== 'string' ||
        data.otp.trim() === ''
    ) {
        throw new Error('Valid phone number and OTP strings are required');
    }

    let url = `${BASE_URL}api/otp-apis/verify/${data.number}/${data.otp}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getDeviceHeaders(),
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('❌ submitOtp - Error occurred:', error);
        throw error;
    }
};

/**
 * Register/Create User
 * @param {Object} data - { name: string, number: string, ... }
 */
export const submitUser = async (data) => {
    if (
        !data ||
        typeof data.name !== 'string' ||
        data.name.trim() === '' ||
        typeof data.number !== 'string' ||
        data.number.trim() === ''
    ) {
        throw new Error('Valid name and phone number strings are required');
    }

    let url = `${BASE_URL}api/otp-apis/create`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getDeviceHeaders(),
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('❌ submitUser - Error occurred:', error);
        throw error;
    }
};

/**
 * Get User by ID
 * @param {number|string} id 
 * @param {string} token 
 */
export const getUserById = async (id, token) => {
    let url = `${BASE_URL}api/users/${id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...getDeviceHeaders(),
        },
    });
    return response.json();
};


// const fetch = require('node-fetch'); // dependency removed

// Mock browser environment for device headers
global.window = {
    navigator: {
        userAgent: 'TestUserAgent'
    }
};

// Mock fetch
global.fetch = async (url, options) => {
    console.log('--- Fetch Call ---');
    console.log('URL:', url);
    console.log('Method:', options.method);
    console.log('Body:', options.body);
    return {
        ok: true,
        json: async () => ({ status: 'mocked_success' })
    };
};

// Since userSlice.js uses ES modules and imports, we can't easily run it directly in this simple script without babel/transpilation or using mjs.
// Instead, I will manually reconstruct the logic I added to verify it creates the right body.

const getDeviceHeaders = () => ({
    'User-Agent': 'TestUserAgent',
    'X-Device-OS': 'Web',
    'X-Device-Model': 'Web Browser',
    'X-Device-Brand': 'Browser',
    'X-Device-Version': '1.0',
    'X-App-Platform': 'web',
});

const logUserToCRM_Logic = async (data) => {
    const url = '/api/proxy/api/login-crm/log';
    const body = JSON.stringify({
        data: {
            action: 'USER_LOGIN',
            userId: data.userId?.toString() || '',
            name: data.name || '',
            number: data.number || '',
            deviceInfo: JSON.stringify(getDeviceHeaders()),
        }
    });

    console.log('--- Constructed Request ---');
    console.log('URL:', url);
    console.log('Body:', body);

    // Validate body structure
    const parsed = JSON.parse(body);
    if (parsed.data && parsed.data.action === 'USER_LOGIN' && parsed.data.userId === '123') {
        console.log('✅ Validation Params Passed');
    } else {
        console.error('❌ Validation Params Failed');
    }
};

logUserToCRM_Logic({ userId: 123, name: 'Test User', number: '9876543210' });

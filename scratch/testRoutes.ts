import fs from 'fs';

const routes = [
  '/',
  '/admin',
  '/admin/analytics',
  '/admin/coupons',
  '/admin/exchanges',
  '/admin/finance',
  '/admin/gifts',
  '/admin/logins',
  '/admin/marketing',
  '/admin/mines',
  '/admin/products',
  '/admin/purchases',
  '/admin/reviews',
  '/admin/saques',
  '/admin/security',
  '/admin/settings',
  '/admin/suporte',
  '/admin/users',
  '/buy/cards',
  '/buy/logins',
  '/checkout',
  '/dashboard',
  '/drops',
  '/faq',
  '/notifications',
  '/recharge',
  '/redeem',
  '/referrals',
  '/reviews',
  '/settings',
  '/duvidas',
  '/login',
  '/register'
];

async function testRoutes() {
  const results = [];
  for (const route of routes) {
    try {
      const res = await fetch(`http://127.0.0.1:3000${route}`);
      results.push(`${route}: ${res.status}`);
    } catch (err: any) {
      results.push(`${route}: ERROR ${err.message}`);
    }
  }
  console.log(results.join('\n'));
}

testRoutes();

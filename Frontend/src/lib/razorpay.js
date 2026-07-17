let loadingPromise = null

/** Loads Razorpay's checkout.js once and resolves with window.Razorpay. */
export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (loadingPromise) return loadingPromise

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(window.Razorpay)
    script.onerror = () => reject(new Error('Could not load the payment gateway. Check your connection.'))
    document.body.appendChild(script)
  })

  return loadingPromise
}

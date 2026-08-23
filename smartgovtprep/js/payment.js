// ==========================================
// SmartGovtPrep - Premium Subscription & Checkout
// ==========================================

const VALID_COUPONS = {
  'SMART50': { discountPercent: 50, label: '50% Flat Discount' },
  'GOVT2026': { discountFlat: 30, label: '₹30 Aspirant Special' },
  'GPSC100': { discountPercent: 100, label: '100% Merit Scholarship' },
  'FIRSTGOVT': { discountPercent: 20, label: '20% Welcome Offer' }
};

class PaymentManager {
  constructor() {
    this.activePlan = 'premium';
    this.appliedCoupon = null;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.modal = document.getElementById('payment-modal');
    this.planTitle = document.getElementById('checkout-plan-title');
    this.planPrice = document.getElementById('checkout-plan-price');
    this.planPeriod = document.getElementById('checkout-plan-period');
    this.planFeatures = document.getElementById('checkout-plan-features');
    this.discountRow = document.getElementById('checkout-discount-row');
    this.discountAmount = document.getElementById('checkout-discount-val');
    this.finalAmount = document.getElementById('checkout-total-val');
    this.payBtn = document.getElementById('checkout-submit-btn');
    this.couponInput = document.getElementById('checkout-coupon-code');
    this.couponApplyBtn = document.getElementById('checkout-apply-coupon-btn');
    this.couponMsg = document.getElementById('checkout-coupon-msg');
  }

  bindEvents() {
    // Open checkout buttons
    const upgradeBtns = document.querySelectorAll('[data-plan-upgrade]');
    upgradeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const plan = e.currentTarget.getAttribute('data-plan-upgrade') || 'premium';
        this.openCheckout(plan);
      });
    });

    const closeBtn = document.getElementById('payment-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeCheckout());
    }

    if (this.couponApplyBtn) {
      this.couponApplyBtn.addEventListener('click', () => this.applyCoupon());
    }

    if (this.payBtn) {
      this.payBtn.addEventListener('click', () => this.processPayment());
    }

    // Payment method radio tabs
    const methodTabs = document.querySelectorAll('.payment-method-tab');
    methodTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        methodTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const method = tab.getAttribute('data-method');
        this.switchPaymentMethod(method);
      });
    });
  }

  openCheckout(planId) {
    this.activePlan = planId.toLowerCase();
    this.appliedCoupon = null;
    if (this.couponInput) this.couponInput.value = '';
    if (this.couponMsg) this.couponMsg.textContent = '';
    if (this.discountRow) this.discountRow.classList.add('hidden');

    const plan = TIERS[this.activePlan.toUpperCase()] || TIERS.PREMIUM;

    if (this.planTitle) this.planTitle.textContent = plan.name;
    if (this.planPrice) this.planPrice.textContent = `₹${plan.price}`;
    if (this.planPeriod) this.planPeriod.textContent = ` / ${plan.period || 'month'}`;

    if (this.planFeatures) {
      this.planFeatures.innerHTML = plan.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('');
    }

    this.updatePriceCalculations();

    if (this.modal) {
      this.modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCheckout() {
    if (this.modal) {
      this.modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  applyCoupon() {
    if (!this.couponInput) return;
    const code = this.couponInput.value.trim().toUpperCase();

    if (!code) {
      if (this.couponMsg) {
        this.couponMsg.className = 'coupon-feedback error';
        this.couponMsg.textContent = 'Please enter a coupon code (e.g. SMART50, GOVT2026, GPSC100).';
      }
      return;
    }

    if (VALID_COUPONS[code]) {
      this.appliedCoupon = { code, ...VALID_COUPONS[code] };
      if (this.couponMsg) {
        this.couponMsg.className = 'coupon-feedback success';
        this.couponMsg.innerHTML = `<i class="fa-solid fa-check"></i> Coupon applied: <strong>${this.appliedCoupon.label}</strong>`;
      }
      this.updatePriceCalculations();
    } else {
      this.appliedCoupon = null;
      if (this.couponMsg) {
        this.couponMsg.className = 'coupon-feedback error';
        this.couponMsg.textContent = 'Invalid coupon code. Try SMART50 or GOVT2026.';
      }
      this.updatePriceCalculations();
    }
  }

  updatePriceCalculations() {
    const plan = TIERS[this.activePlan.toUpperCase()] || TIERS.PREMIUM;
    let basePrice = plan.price;
    let discount = 0;

    if (this.appliedCoupon) {
      if (this.appliedCoupon.discountPercent) {
        discount = (basePrice * this.appliedCoupon.discountPercent) / 100;
      } else if (this.appliedCoupon.discountFlat) {
        discount = Math.min(basePrice, this.appliedCoupon.discountFlat);
      }
    }

    const total = Math.max(0, basePrice - discount);

    if (this.discountRow && this.discountAmount) {
      if (discount > 0) {
        this.discountRow.classList.remove('hidden');
        this.discountAmount.textContent = `-₹${discount.toFixed(0)}`;
      } else {
        this.discountRow.classList.add('hidden');
      }
    }

    if (this.finalAmount) {
      this.finalAmount.textContent = `₹${total.toFixed(0)}`;
    }

    if (this.payBtn) {
      this.payBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Pay ₹${total.toFixed(0)} & Activate Plan`;
    }
  }

  switchPaymentMethod(method) {
    const upiView = document.getElementById('pay-method-upi');
    const qrView = document.getElementById('pay-method-qr');
    const cardView = document.getElementById('pay-method-card');
    const netView = document.getElementById('pay-method-netbanking');

    [upiView, qrView, cardView, netView].forEach(v => v?.classList.add('hidden'));

    if (method === 'upi' && upiView) upiView.classList.remove('hidden');
    if (method === 'qr' && qrView) qrView.classList.remove('hidden');
    if (method === 'card' && cardView) cardView.classList.remove('hidden');
    if (method === 'netbanking' && netView) netView.classList.remove('hidden');
  }

  processPayment() {
    if (!this.payBtn) return;
    const originalText = this.payBtn.innerHTML;
    this.payBtn.disabled = true;
    this.payBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Secure Payment...`;

    setTimeout(() => {
      const plan = TIERS[this.activePlan.toUpperCase()] || TIERS.PREMIUM;
      const success = window.authManager.upgradeTier(this.activePlan, plan.name);

      this.payBtn.disabled = false;
      this.payBtn.innerHTML = originalText;
      this.closeCheckout();

      if (success) {
        window.showCelebrationModal(
          `🎉 Welcome to SmartGovtPrep ${plan.name}!`,
          `Your subscription has been successfully activated. You now have unlocked <strong>${plan.features.join(', ')}</strong>!`
        );
      }
    }, 1200);
  }
}

window.paymentManager = new PaymentManager();

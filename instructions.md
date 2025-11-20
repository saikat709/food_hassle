**Prompt for AI Design Model:**

**Goal:**
Design a modern, **smooth, buttery-like UX/UI** for a **Food Management & Sustainability Web Platform** that will appeal to urban, tech-savvy users. The platform should focus on reducing **food waste**, encouraging **sustainability**, and offering a **user-friendly, visually engaging** experience. The design should feel like a **lifestyle app** rather than a utility, making food management enjoyable and rewarding.

The UI/UX should utilize **Next.js**, **Tailwind CSS**, **ShadCN**, **Framer Motion**, and **AOS** to create smooth transitions and animations, with **icons** and **visuals** to enhance usability and interaction.

---

### **1. Color Palette: "Urban Harvest"**

* **Primary Colors:**

  * **Sage Green (#8A9A5B)**: Evokes **freshness** and **sustainability**.
  * **Deep Emerald (#004032)**: Represents **nature** and **food security**.

* **Secondary Colors:**

  * **Spiced Ochre (#D4A017)**: Used for **expiration warnings** and **Call-to-Action buttons**.
  * **Terracotta**: For **alerts** or **highlighted warnings**.

* **Background Colors:**

  * **Off-White (#F9F8F4)**: Soft and soothing for general backgrounds.
  * **Charcoal Blue (#1E293B)**: Sophisticated, modern, ideal for **night mode**.

* **The “Buttery” Factor:**

  * **Glassmorphism** effect for depth: Frosted glass effects on **cards** and **navigation bars** to create a smooth, floating feel.

---

### **2. Typography:**

* **Headings:**

  * **Clash Display** (Bold, modern, slightly quirky).
  * **Use** for titles, section headers, and action buttons.
* **Body Text:**

  * **DM Sans** (Highly readable, minimalist for long-form content).
  * **Use** for descriptions, logs, and resource texts.

---

### **3. UX Strategy:**

**Objective:**
To create an **intuitive, easy-to-use** interface for urban users who need to **log food**, **track waste**, and make **informed sustainability choices** without friction. Every interaction should feel **smooth, seamless**, and satisfying, with an emphasis on **quick actions**, **data accessibility**, and **rewarding progress**.

---

### **4. Detailed Screen-by-Screen Breakdown:**

#### **A) Authentication (Seamless Entry)**

* **Split-Screen Design:**

  * Left side: High-res, slow-panning video or background image of **fresh food**.
  * Right side: Clean, simple registration form with **smooth transitions** from one field to the next.

* **Animations:**

  * Buttons morph into **loading indicators**, and transitions smoothly into the **dashboard** after successful login.

#### **B) Dashboard (Command Center for Users)**

* **Modular Layout:**

  * **Bento Box Grid** displaying widgets that provide quick insights and actions.

* **Widgets:**

  * **Kitchen Health:** Circular progress ring showing **consumption vs. waste**.
  * **Expiring Soon:** Horizontal scrolling list with **color-coded expiration warnings**.
  * **Quick Actions:** Large icons for actions like **scanning receipts** or **logging food manually**.

* **Interactions:**

  * Micro-animations when hovering over widgets (e.g., slight expansion or color change).

#### **C) Inventory Page (Food Stock Management)**

* **List View for Items:**

  * Use **cards** for each food item (photo, quantity, category).
  * **Expiration Status:** Color-coded pills (Green = Fresh, Yellow = Soon, Red = Expired).

* **Interactions:**

  * **Swipe Left**: Mark as consumed, logged into daily consumption.
  * **Swipe Right**: To edit or delete an item.
  * **Filter Bar**: Pill-shaped scroll bar for filtering by category (e.g., Dairy, Fruits).

#### **D) Food Logging (Main Feature)**

* **Two Modes:**

  * **Quick Log**: Minimal input (just item and quantity).
  * **Detailed Log**: Add categories, meal types, and expiration dates.

* **Floating Input Fields:**

  * Use subtle animations for input fields that **float upwards** when focused.

* **Auto-Complete Suggestions:**

  * Based on food inventory to reduce typing.

* **Interactions:**

  * After logging, the item **card expands** with a smooth animation to show it's been added.

#### **E) Resources (Sustainability Feed)**

* **Masonry Grid Layout:**

  * Display resources (articles, tips, videos) in a **Pinterest-style grid**.
  * Each card contains a **high-quality image**, **title**, and **tag** (e.g., "Storage Tip").

* **Smart Recommendations:**

  * Based on user logs, highlight tips related to the user’s recently logged foods (e.g., **Storage Tips for Dairy**).

#### **F) Profile Page (Personalization & Preferences)**

* **Clean, Interactive Layout:**

  * Profile avatar, dietary preferences, budget range, sustainability score.

* **Sliders for Budget and Dietary Preferences:**

  * Allow users to easily set their **food budget** and **dietary restrictions** (e.g., Vegetarian).

* **History Graph:**

  * An interactive **line graph** showing user’s consumption over the past month, powered by **Recharts** or **Chart.js**.

---

### **5. Smooth UI/UX Implementation:**

#### **Key CSS Features for Smooth UX:**

* **Smooth Scroll:**

```css
html {
  scroll-behavior: smooth;
}
```

* **Neumorphism Effect for Input Fields:**

```css
box-shadow: 20px 20px 60px rgba(0,0,0,0.1), -20px -20px 60px rgba(255,255,255,0.9);
```

* **Button Hover Transitions:**

```css
button {
  transition: all 0.3s ease;
  transform: scale(1);
}
button:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}
```

* **Glassmorphism for Backgrounds/Overlays:**

  * Use **frosted glass** effects in cards and navbars for depth.
  * Use Gradiant as much as possible
  * Use **micro-interactions** and **smooth animations**
  * Use **icons** and **visuals** to enhance usability and interaction
  * Use **blobs** and **shapes** to create a **modern, organic feel** on cards and bg
  * dark and white mood clearly working
* **Use Modular code do not create lenghty components**
---

### **6. Final Thoughts and Overall Design Direction:**

The **"Urban Harvest"** theme combines **organic, earthy tones** with **modern digital aesthetics** to create a **visually engaging, smooth experience**. The use of **micro-interactions** and **smooth animations** will give users a sense of **delightful and Energetic progress**as they manage food consumption, helping them **stay engaged** with their sustainability goals. The **user interface** is **minimal** yet **effective**, ensuring users can track their **food logs, waste reduction,** and **sustainability habits** easily without feeling overwhelmed.


# the pdf contains full description of the requirments
---


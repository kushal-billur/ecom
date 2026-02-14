const banners = [
    {
        id: "banner-1",
        title: "Fresh Fruits & Veggies",
        subtitle: "Up to 40% OFF",
        description: "Get farm-fresh fruits and vegetables delivered in 10 minutes",
        bgColor: "linear-gradient(135deg, #0C831F 0%, #16a34a 100%)",
        textColor: "#fff",
        tag: "FRESH DEALS",
        image: "https://cdn-icons-png.flaticon.com/512/2153/2153786.png"
    },
    {
        id: "banner-2",
        title: "Dairy Essentials",
        subtitle: "Starting ₹29",
        description: "Milk, curd, paneer & more at best prices",
        bgColor: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
        textColor: "#fff",
        tag: "DAILY NEEDS",
        image: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png"
    },
    {
        id: "banner-3",
        title: "Snack O'Clock",
        subtitle: "Buy 2 Get 1 Free",
        description: "Chips, namkeen, biscuits & more",
        bgColor: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
        textColor: "#fff",
        tag: "MEGA OFFER",
        image: "https://cdn-icons-png.flaticon.com/512/2553/2553691.png"
    },
    {
        id: "banner-4",
        title: "Cold Drinks & Juices",
        subtitle: "Flat 30% OFF",
        description: "Beat the heat with refreshing beverages",
        bgColor: "linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)",
        textColor: "#fff",
        tag: "COOL DEALS",
        image: "https://cdn-icons-png.flaticon.com/512/3076/3076070.png"
    },
    {
        id: "banner-5",
        title: "Cleaning Supplies",
        subtitle: "Under ₹99",
        description: "Keep your home sparkling clean",
        bgColor: "linear-gradient(135deg, #0D9488 0%, #2DD4BF 100%)",
        textColor: "#fff",
        tag: "HOME CARE",
        image: "https://cdn-icons-png.flaticon.com/512/995/995016.png"
    }
];

const deals = [
    {
        id: "deal-1",
        title: "Fruits & Vegetables",
        discount: "UP TO 40% OFF",
        image: "https://cdn-icons-png.flaticon.com/512/2153/2153786.png",
        bgColor: "#E8F5E9",
        expiresIn: 7200
    },
    {
        id: "deal-2",
        title: "Dairy Products",
        discount: "UP TO 25% OFF",
        image: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png",
        bgColor: "#FFF3E0",
        expiresIn: 5400
    },
    {
        id: "deal-3",
        title: "Instant Food",
        discount: "BUY 2 GET 1",
        image: "https://cdn-icons-png.flaticon.com/512/1046/1046747.png",
        bgColor: "#FCE4EC",
        expiresIn: 3600
    },
    {
        id: "deal-4",
        title: "Chocolates",
        discount: "FLAT 30% OFF",
        image: "https://cdn-icons-png.flaticon.com/512/3014/3014440.png",
        bgColor: "#F3E5F5",
        expiresIn: 9000
    }
];

module.exports = { banners, deals };

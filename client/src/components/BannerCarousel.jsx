import { useState, useEffect, useRef } from 'react';

export default function BannerCarousel({ banners }) {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        startAutoSlide();
        return () => clearInterval(intervalRef.current);
    }, [banners.length]);

    const startAutoSlide = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % banners.length);
        }, 4000);
    };

    const goTo = (index) => {
        setCurrent(index);
        startAutoSlide();
    };

    if (!banners.length) return null;

    return (
        <div className="banner-carousel">
            <div
                className="banner-track"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="banner-slide"
                        style={{ background: banner.bgColor }}
                    >
                        <div className="banner-content">
                            <span className="banner-tag">{banner.tag}</span>
                            <h2>{banner.title}</h2>
                            <div className="banner-subtitle">{banner.subtitle}</div>
                            <p>{banner.description}</p>
                        </div>
                        <img className="banner-image" src={banner.image} alt={banner.title} />
                    </div>
                ))}
            </div>
            <button className="banner-nav-btn prev" onClick={() => goTo((current - 1 + banners.length) % banners.length)}>‹</button>
            <button className="banner-nav-btn next" onClick={() => goTo((current + 1) % banners.length)}>›</button>
            <div className="banner-dots">
                {banners.map((_, idx) => (
                    <div
                        key={idx}
                        className={`banner-dot ${idx === current ? 'active' : ''}`}
                        onClick={() => goTo(idx)}
                    />
                ))}
            </div>
        </div>
    );
}

import { ContactEquation, ICollisionEvent } from "cannon";

const woodHitSound = new Audio('/sound/hit.mp3');

export const playWoodHitSound = (collision: ICollisionEvent) => {
    let impactStrength = collision.contact.getImpactVelocityAlongNormal();
    // 碰撞强度>1.5时才播放
    if (impactStrength > 3) {
        impactStrength = impactStrength > 100 ? 100 : impactStrength;
        impactStrength /= 100;
        woodHitSound.volume = impactStrength;
        woodHitSound.currentTime = 0;
        woodHitSound.play();
    }
}
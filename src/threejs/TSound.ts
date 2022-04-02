import { ContactEquation, ICollisionEvent } from "cannon";

export const woodHitSound = new Audio('/sound/hit.mp3');
export const woodHitSound2 = new Audio('/sound/wood hit2.mp3');

export const playHitSound = (audio: HTMLAudioElement, collision: ICollisionEvent) => {
    let impactStrength = collision.contact.getImpactVelocityAlongNormal();
    // 碰撞强度>1.5时才播放
    if (impactStrength > 3) {
        impactStrength = impactStrength > 100 ? 100 : impactStrength;
        impactStrength /= 100;
        audio.volume = impactStrength;
        audio.currentTime = 0;
        audio.play();
    }
}
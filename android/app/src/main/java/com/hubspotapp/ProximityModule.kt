package com.hubspotapp

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.PowerManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class ProximityModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), SensorEventListener {

    private val sensorManager: SensorManager =
        reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val proximity: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY)
    private val pm: PowerManager =
        reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
    private val wakeLock: PowerManager.WakeLock =
        pm.newWakeLock(PowerManager.PROXIMITY_SCREEN_OFF_WAKE_LOCK, "YourApp::ProximityWakeLock")

    override fun getName(): String {
        return "Proximity"
    }

    @ReactMethod
    fun start() {
        proximity?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    @ReactMethod
    fun stop() {
        sensorManager.unregisterListener(this)
        if (wakeLock.isHeld) {
            wakeLock.release()
        }
    }

    // 👇 Add these two methods
    @ReactMethod
    fun addListener(eventName: String?) {
        // Required by RN
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required by RN
    }

    override fun onSensorChanged(event: android.hardware.SensorEvent) {
        val isNear = event.values[0] < (proximity?.maximumRange ?: 0f)
        if (isNear && !wakeLock.isHeld) {
            wakeLock.acquire()
        } else if (!isNear && wakeLock.isHeld) {
            wakeLock.release()
        }

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("Proximity", isNear)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}

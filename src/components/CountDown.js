import React, { useState, useEffect, useRef, useCallback } from "react";
import { Text, StyleSheet } from "react-native";
import { fontSizes, spacing } from "../utils/sizes";
import { colors } from "../utils/colors";

const minutesToMillis = (min) => Math.floor(min * 1000 * 60);
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes = 0.1, isPaused, onProgress, onEnd }) => {
    const interval = useRef(null);
    const [millis, setMillis] = useState(minutesToMillis(minutes));

    const reset = useCallback(() => {
        setMillis(minutesToMillis(minutes));
    }, [minutes]);

    useEffect(() => {
        setMillis(minutesToMillis(minutes));
    }, [minutes]);

    useEffect(() => {
    onProgress(parseFloat((millis / minutesToMillis(minutes)).toFixed(2)));
}, [millis, minutes, onProgress]);


    useEffect(() => {
        if (isPaused) {
            if (interval.current) clearInterval(interval.current);
            return;
        }

        interval.current = setInterval(() => {
            setMillis((time) => {
                if (time === 0) {
                    clearInterval(interval.current);
                    onEnd(reset);
                    return minutesToMillis(minutes);
                }
                return time - 1000;
            });
        }, 1000);

        return () => clearInterval(interval.current);
    }, [isPaused, minutes, onEnd, reset]);

    const minute = Math.floor(millis / 1000 / 60) % 60;
    const seconds = Math.floor(millis / 1000) % 60;

    console.log(`dbg: minute= ${minute}, seconds=${seconds}`);
    return (
        <Text style={styles.text}>
            {formatTime(minute)}:{formatTime(seconds)}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: fontSizes.xxxl,
        fontWeight: "bold",
        color: colors.white,
        padding: spacing.lg,
        backgroundColor: "rgba(94, 132, 226, 0.3)",
    },
});

import { createApp } from "vue";
import "./style.css";
import WatermarkRemover from "./WatermarkRemover.vue";

const app = createApp(WatermarkRemover);

app.mount("#wrShadowroot");

import styles from "./form.module.css";

type FormButtonData = {
  btnValue: string;
  btnHandler: () => void;
};

type FormProps = {
  formLabel: string;
  inputValue: string;
  inputPlaceholder: string;
  inputFieldComment?: string;
  inputFieldCommentClass?: string;
  inputFieldClass?: string;
  onEnterPressed?: () => void;
  inputChangeHandler: (value: string) => void;
  formButtonData: FormButtonData[];
  centerSelf?: boolean;
};

export default function CustomForm({
  formLabel,
  inputValue,
  inputPlaceholder,
  inputFieldComment,
  inputFieldCommentClass,
  inputFieldClass,
  onEnterPressed,
  inputChangeHandler,
  formButtonData,
  centerSelf = false,
}: FormProps) {
  return (
    <div className={`${styles.form} ${centerSelf ? styles.centerSelf : ""}`}>
      <div className={styles.formContent}>
        <label className={styles.formFieldLabel} htmlFor="formField">
          {formLabel}
        </label>

        <input
          onChange={(e) => inputChangeHandler(e.target.value)}
          onKeyUp={(e) => {
            if (!onEnterPressed || e.key != "Enter") return;
            onEnterPressed();
          }}
          value={inputValue}
          className={`${styles.formField} ${inputFieldClass}`}
          type="text"
          id="formField"
          placeholder={inputPlaceholder}
        />

        <p className={`${styles.fieldComment} ${inputFieldCommentClass}`}>
          {inputFieldComment}
        </p>
      </div>

      <div className={styles.formBtns}>
        {formButtonData.map((btnData, idx) => {
          return (
            <button
              key={idx}
              onClick={btnData.btnHandler}
              className={styles.formBtn}
              type="button"
            >
              {btnData.btnValue}
            </button>
          );
        })}
      </div>
    </div>
  );
}

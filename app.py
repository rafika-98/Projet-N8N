import os
import sys

import requests
from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)


API_URL = "https://api.mistral.ai/v1/chat/completions"
DEFAULT_MODEL = "mistral-tiny"


class MistralChatApp(QWidget):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("Mistral Chat")

        layout = QVBoxLayout(self)

        layout.addWidget(QLabel("Posez votre question :"))

        self.prompt_input = QLineEdit(self)
        self.prompt_input.setPlaceholderText("Entrez votre question pour Mistral AI")
        layout.addWidget(self.prompt_input)

        self.send_button = QPushButton("Envoyer", self)
        self.send_button.clicked.connect(self.on_send_clicked)
        layout.addWidget(self.send_button)

        layout.addWidget(QLabel("Réponse :"))

        self.output_area = QTextEdit(self)
        self.output_area.setReadOnly(True)
        layout.addWidget(self.output_area)

    def display_error(self, message: str) -> None:
        QMessageBox.critical(self, "Erreur", message)

    def set_loading_state(self, loading: bool) -> None:
        self.send_button.setDisabled(loading)
        self.prompt_input.setDisabled(loading)
        if loading:
            QApplication.setOverrideCursor(Qt.WaitCursor)
        else:
            QApplication.restoreOverrideCursor()

    def on_send_clicked(self) -> None:
        prompt = self.prompt_input.text().strip()
        if not prompt:
            self.display_error("Veuillez saisir une question avant d'envoyer.")
            return

        api_key = os.environ.get("MISTRAL_API_KEY")
        if not api_key:
            self.display_error("La clé API MISTRAL_API_KEY n'est pas définie dans l'environnement.")
            return

        self.set_loading_state(True)
        try:
            response_text = self.query_mistral(prompt, api_key)
        except Exception as exc:  # pylint: disable=broad-except
            response_text = f"Erreur lors de l'appel à l'API : {exc}"
        finally:
            self.set_loading_state(False)

        self.output_area.setPlainText(response_text)

    def query_mistral(self, prompt: str, api_key: str) -> str:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": DEFAULT_MODEL,
            "messages": [
                {"role": "user", "content": prompt},
            ],
        }

        response = requests.post(API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()

        return self.extract_message(data)

    @staticmethod
    def extract_message(data: dict) -> str:
        try:
            choices = data.get("choices", [])
            if not choices:
                return "Aucune réponse reçue."

            message = choices[0]["message"]["content"]
            return message if isinstance(message, str) else str(message)
        except (KeyError, TypeError) as error:
            raise ValueError("Format de réponse inattendu de l'API Mistral") from error


def main() -> int:
    app = QApplication(sys.argv)
    window = MistralChatApp()
    window.resize(500, 400)
    window.show()
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())

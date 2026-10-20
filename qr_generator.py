import qrcode

def url_to_qr(url, filename="qrcode.png"):
    qr = qrcode.QRCode(
        version=1,                                        # size of the QR code (1-40), auto-adjusts if needed
        error_correction=qrcode.constants.ERROR_CORRECT_M,  # error tolerance
        box_size=10,                                      # pixels per box
        border=4,                                         # border thickness in boxes
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    print(f"QR code saved as {filename}")

if __name__ == "__main__":
    url = input("Enter the URL: ").strip()
    url_to_qr(url)
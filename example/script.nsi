; Beispiel-Skript
Name "MeinBeispiel"
OutFile "installer.exe"
SetCompressor lzma
InstallDir "$PROGRAMFILES\example"
InstallDirRegKey HKLM "SOFTWARE\example" "installdir"
LoadLanguageFile "${NSISDIR}\Contrib\Language files\German.nlf"
Page directory
Page instfiles
Section
  SetOutPath $INSTDIR
  File "test.txt"
  CreateShortCut "$DESKTOP\example.lnk" "$OUTDIR\test.txt"
SectionEnd

